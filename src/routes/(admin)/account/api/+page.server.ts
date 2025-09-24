import { fail, redirect } from "@sveltejs/kit"
import { sendAdminEmail, sendUserEmail } from "$lib/mailer"
import { WebsiteBaseUrl } from "../../../../config"
import { message, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import {
  ChangePasswordSchema,
  NewsLetterForm,
  ChangeEmailSchema,
  DeleteAccountSchema,
  ReqConsultForm,
} from "$lib/schemas"
import {
  MAIL_CHIMP_API_KEY,
  MAIL_CHIMP_SERVER_PREFIX,
  MAIL_CHIMP_AUDIENCE_ID,
} from "$env/static/private"
import { CreateNotification } from "$lib/schemas"
import type { Provider } from "@supabase/supabase-js"
import { getLocale } from "$lib/paraglide/runtime.js"

export const actions = {
  toggleEmailSubscription: async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()

    if (!session) {
      redirect(303, "/login")
    }

    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("unsubscribed")
      .eq("id", session.user.id)
      .single()

    const newUnsubscribedStatus = !currentProfile?.unsubscribed

    const { error } = await supabase
      .from("profiles")
      .update({ unsubscribed: newUnsubscribedStatus })
      .eq("id", session.user.id)

    if (error) {
      console.error("Error updating subscription status", error)
      return fail(500, { message: "Failed to update subscription status" })
    }

    return {
      unsubscribed: newUnsubscribedStatus,
    }
  },
  updateEmail: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      redirect(303, "/login")
    }

    const formData = await request.formData()
    const email = formData.get("email") as string

    let validationError
    if (!email || email === "") {
      validationError = "An email address is required"
    }
    // Dead simple check -- there's no standard here (which is followed),
    // and lots of errors will be missed until we actually email to verify, so
    // just do that
    else if (!email.includes("@")) {
      validationError = "A valid email address is required"
    }
    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields: ["email"],
        email,
      })
    }

    // Supabase does not change the email until the user verifies both
    // if 'Secure email change' is enabled in the Supabase dashboard
    const { error } = await supabase.auth.updateUser({ email: email })

    if (error) {
      console.error("Error updating email", error)
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        email,
      })
    }

    return {
      email,
    }
  },
  updatePassword: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session, user, amr } = await safeGetSession()
    if (!session) {
      redirect(303, "/login")
    }
    const formData = await request.formData()
    const newPassword1 = formData.get("newPassword1") as string
    const newPassword2 = formData.get("newPassword2") as string
    const currentPassword = formData.get("currentPassword") as string

    // Can check if we're a "password recovery" session by checking session amr
    // let currentPassword take priority if provided (user can use either form)
    const recoveryAmr = amr?.find((x) => x.method === "recovery")
    const isRecoverySession = recoveryAmr && !currentPassword

    // if this is password recovery session, check timestamp of recovery session
    if (isRecoverySession) {
      const timeSinceLogin = Date.now() - recoveryAmr.timestamp * 1000
      if (timeSinceLogin > 1000 * 60 * 15) {
        // 15 mins in milliseconds
        return fail(400, {
          errorMessage:
            'Recovery code expired. Please log out, then use "Forgot Password" on the sign in page to reset your password. Codes are valid for 15 minutes.',
          errorFields: [],
          newPassword1,
          newPassword2,
          currentPassword: "",
        })
      }
    }

    let validationError
    const errorFields = []
    if (!newPassword1) {
      validationError = "You must type a new password"
      errorFields.push("newPassword1")
    }
    if (!newPassword2) {
      validationError = "You must type the new password twice"
      errorFields.push("newPassword2")
    }
    if (newPassword1.length < 6) {
      validationError = "The new password must be at least 6 charaters long"
      errorFields.push("newPassword1")
    }
    if (newPassword1.length > 72) {
      validationError = "The new password can be at most 72 charaters long"
      errorFields.push("newPassword1")
    }
    if (newPassword1 != newPassword2) {
      validationError = "The passwords don't match"
      errorFields.push("newPassword1")
      errorFields.push("newPassword2")
    }
    if (!currentPassword && !isRecoverySession) {
      validationError =
        "You must include your current password. If you forgot it, sign out then use 'forgot password' on the sign in page."
      errorFields.push("currentPassword")
    }
    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields: [...new Set(errorFields)], // unique values
        newPassword1,
        newPassword2,
        currentPassword,
      })
    }

    // Check current password is correct before updating, but only if they didn't log in with "recover" link
    // Note: to make this truly enforced you need to contact supabase. See: https://www.reddit.com/r/Supabase/comments/12iw7o1/updating_password_in_supabase_seems_insecure/
    // However, having the UI accessible route still verify password is still helpful, and needed once you get the setting above enabled

    if (!isRecoverySession) {
      const { error, data: resss } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      })

      if (error) {
        // The user was logged out because of bad password. Redirect to error page explaining.
        // redirect(303, "/login/current_password_error")

        return fail(500, {
          errorMessage: "The current Passowrd is not correct.",
          newPassword1,
          newPassword2,
          currentPassword,
        })
      }
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword1,
    })
    if (error) {
      console.error("Error updating password", error)
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        newPassword1,
        newPassword2,
        currentPassword,
      })
    }

    return {
      newPassword1,
      newPassword2,
      currentPassword,
    }
  },
  deleteAccount: async ({
    request,
    locals: { supabase, supabaseServiceRole, safeGetSession },
  }) => {
    const { session, user } = await safeGetSession()
    if (!session || !user?.id) {
      redirect(303, "/login")
    }

    const formData = await request.formData()
    const currentPassword = formData.get("currentPassword") as string

    if (!currentPassword) {
      return fail(400, {
        errorMessage:
          "You must provide your current password to delete your account. If you forgot it, sign out then use 'forgot password' on the sign in page.",
        errorFields: ["currentPassword"],
        currentPassword,
      })
    }

    // Check current password is correct before deleting account
    const { error: pwError } = await supabase.auth.signInWithPassword({
      email: user?.email || "",
      password: currentPassword,
    })
    if (pwError) {
      // The user was logged out because of bad password. Redirect to error page explaining.
      redirect(303, "/login/current_password_error")
    }

    const { error } = await supabaseServiceRole.auth.admin.deleteUser(
      user.id,
      true,
    )
    if (error) {
      console.error("Error deleting user", error)
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        currentPassword,
      })
    }

    await supabase.auth.signOut()
    redirect(303, "/")
  },
  updateProfile: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session, user } = await safeGetSession()
    if (!session || !user?.id) {
      redirect(303, "/login")
    }

    const formData = await request.formData()
    const fullName = formData.get("fullName") as string
    const companyName = formData.get("companyName") as string
    const website = formData.get("website") as string

    let validationError
    const fieldMaxTextLength = 50
    const errorFields = []
    if (!fullName) {
      validationError = "Name is required"
      errorFields.push("fullName")
    } else if (fullName.length > fieldMaxTextLength) {
      validationError = `Name must be less than ${fieldMaxTextLength} characters`
      errorFields.push("fullName")
    }
    if (!companyName) {
      validationError =
        "Company name is required. If this is a hobby project or personal app, please put your name."
      errorFields.push("companyName")
    } else if (companyName.length > fieldMaxTextLength) {
      validationError = `Company name must be less than ${fieldMaxTextLength} characters`
      errorFields.push("companyName")
    }
    if (!website) {
      validationError =
        "Company website is required. An app store URL is a good alternative if you don't have a website."
      errorFields.push("website")
    } else if (website.length > fieldMaxTextLength) {
      validationError = `Company website must be less than ${fieldMaxTextLength} characters`
      errorFields.push("website")
    }
    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields,
        fullName,
        companyName,
        website,
      })
    }

    // To check if created or updated, check if priorProfile exists
    const { data: priorProfile, error: priorProfileError } = await supabase
      .from("profiles")
      .select(`*`)
      .eq("id", session?.user.id)
      .single()

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        updated_at: new Date().toISOString(),
        full_name: fullName,
        company_name: companyName,
        website: website,
        unsubscribed: priorProfile?.unsubscribed ?? false,
      })
      .select()

    if (error) {
      console.error("Error updating profile", error)
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        fullName,
        companyName,
        website,
      })
    }

    // If the profile was just created, send an email to the user and admin
    const newProfile =
      priorProfile?.updated_at === null && priorProfileError === null
    if (newProfile) {
      await sendAdminEmail({
        subject: "Profile Created",
        body: `Profile created by ${session.user.email}\nFull name: ${fullName}\nCompany name: ${companyName}\nWebsite: ${website}`,
      })

      // Send welcome email
      await sendUserEmail({
        user: session.user,
        subject: "Welcome!",
        from_email: "no-reply@saasstarter.work",
        template_name: "welcome_email",
        template_properties: {
          companyName: "SaaS Starter",
          WebsiteBaseUrl: WebsiteBaseUrl,
        },
      })
    }

    return {
      fullName,
      companyName,
      website,
    }
  },
  signout: async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (session) {
      await supabase.auth.signOut()
      redirect(303, "/")
    } else {
      redirect(303, "/")
    }
  },
  updatePassword2: async ({
    request,
    locals: { supabase, safeGetSession },
  }) => {
    const { session, user, amr } = await safeGetSession()
    if (!session) {
      redirect(303, "/login")
    }
    const form = await superValidate(request, zod(ChangePasswordSchema))

    if (!form.valid) {
      return fail(400, { form })
    }
    const formData = form.data
    const newPassword1 = formData.newPassword
    const newPassword2 = formData.confirmPassword
    const currentPassword = formData.currentPassword

    // Can check if we're a "password recovery" session by checking session amr
    // let currentPassword take priority if provided (user can use either form)
    const recoveryAmr = amr?.find((x) => x.method === "recovery")
    const isRecoverySession = recoveryAmr && !currentPassword

    // if this is password recovery session, check timestamp of recovery session
    if (isRecoverySession) {
      const timeSinceLogin = Date.now() - recoveryAmr.timestamp * 1000
      if (timeSinceLogin > 1000 * 60 * 15) {
        // 15 mins in milliseconds
        return fail(400, {
          errorMessage:
            'Recovery code expired. Please log out, then use "Forgot Password" on the sign in page to reset your password. Codes are valid for 15 minutes.',
          errorFields: [],
          newPassword1,
          newPassword2,
          currentPassword: "",
        })
      }
    }

    let validationError
    const errorFields = []
    if (!currentPassword && !isRecoverySession) {
      validationError =
        "You must include your current password. If you forgot it, sign out then use 'forgot password' on the sign in page."
      errorFields.push("currentPassword")
    }
    if (validationError) {
      form.message = validationError
      return fail(400, {
        form,
      })
    }

    // Check current password is correct before updating, but only if they didn't log in with "recover" link
    // Note: to make this truly enforced you need to contact supabase. See: https://www.reddit.com/r/Supabase/comments/12iw7o1/updating_password_in_supabase_seems_insecure/
    // However, having the UI accessible route still verify password is still helpful, and needed once you get the setting above enabled

    if (!isRecoverySession) {
      const { error, data: resss } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      })

      if (error) {
        // The user was logged out because of bad password. Redirect to error page explaining.
        // redirect(303, "/login/current_password_error")
        return message(form, error.message, {
          status: 403,
        })
      }
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword1,
    })
    if (error) {
      console.error("Error updating password", error)

      return message(form, error.message, {
        status: 404,
      })
    }
    return {
      form,
      message: "Password updated successfully",
      status: 200,
    }
  },
  subNewsLetter: async ({
    request,
    locals: { supabase, supabaseServiceRole },
  }) => {
    const form = await superValidate(request, zod(NewsLetterForm))

    if (!form.valid) {
      form.message = "invalid Form"
      return fail(400, { form })
    }

    const { email, funding_guide, sub_newsletter } = form.data
    const { error } = await supabaseServiceRole.from("newsletter").insert({
      email: email,
      funding_guide: funding_guide,
      sub_newsletter: sub_newsletter,
    })
    let tags
    if (funding_guide && sub_newsletter) {
      tags = ["funding_guide", "sub_newsletter"]
    } else if (funding_guide) {
      tags = ["funding_guide"]
    } else if (sub_newsletter) {
      tags = ["sub_newsletter"]
    }
    const customUrl = `https://${MAIL_CHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAIL_CHIMP_AUDIENCE_ID}/members`

    const response = await fetch(customUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${MAIL_CHIMP_API_KEY}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        tags: tags,
      }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      console.log("errorData", errorData)
      form.message = errorData.detail || "Error sending mail. Try again."
      return fail(400, { form })
    }

    if (error) {
      console.log("error", error)
      form.message =
        error.code === "23505"
          ? "Email already exist. Try another one."
          : error.message
      return fail(400, { form })
    }
    return { form }
  },
  bookmark: async ({ request, locals: { session, supabase } }) => {
    const formData = await request.formData()

    const fundingId = formData.get("fundingId")

    if (!fundingId || typeof fundingId !== "string") {
      return fail(400, { error: "Invalid funding ID" })
    }
    if (!session?.user) {
      return fail(401, { error: "Please log in to bookmark this item" })
    }
    const { error } = await supabase.from("bookmarks").insert({
      user_id: session.user.id,
      funding_id: fundingId,
    })
    console.log("Bookmarking result:", error)
    if (error && error.code === "23505") {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", session.user.id)
        .eq("funding_id", fundingId)
      return {
        success: true,
        message: "Bookmark removed",
        status: "BOOKMARK_REMOVED",
      }
    }
    if (error) {
      return fail(500, { error: error.message })
    }

    return { success: true }
  },
  createNotification: async ({ request, locals: { session, supabase } }) => {
    const form = await superValidate(request, zod(CreateNotification))
    console.log("Create Notifcation form", form.data)
    if (!form.valid) {
      return fail(400, { form })
    }
    if (!session) {
      form.message = "You'r not logged in"
      return fail(401, { form })
    }
    const { data } = form
    const { error } = await supabase.from("notifications").insert({
      user_id: session.user.id,
      project_name: data.projectName,
      description: data.description,
      end_date: data.endDate,
      start_date: data.startDate,
      funding_purpose: data.fundingPurpose,
      industry: data.industry,
      project_stage: data.projectStage,
      project_type: data.projectType,
      budget_min: data.projectBudget[0],
      budget_max: data.projectBudget[1],
    })
    if (error) {
      form.message = error.message
      return fail(500, { form })
    }
    console.log("Validation successful! Saving data:", data)

    return { form }
  },
  updateNotification: async ({ request, locals: { session, supabase } }) => {
    const form = await superValidate(request, zod(CreateNotification))
    console.log("Update Notifcation form", form.data)

    const notificationId = form.data.id
    console.log("notificationId---->", notificationId)
    if (!form.valid) {
      console.log("Form Validation Failed")
      return fail(400, { form })
    }
    if (!session) {
      form.message = "You'r not logged in"
      return fail(401, { form })
    }
    const { data } = form
    const { error } = await supabase
      .from("notifications")
      .update({
        user_id: session.user.id,
        project_name: data.projectName,
        description: data.description,
        end_date: data.endDate,
        start_date: data.startDate,
        funding_purpose: data.fundingPurpose,
        industry: data.industry,
        project_stage: data.projectStage,
        project_type: data.projectType,
        budget_min: data.projectBudget[0],
        budget_max: data.projectBudget[1],
      })
      .eq("user_id", session.user.id)
      .eq("id", `${notificationId}`)
    if (error) {
      form.message = error.message
      return fail(500, { form })
    }
    console.log("Validation successful! Saving data:", data)

    return { form }
  },
  deleteNotification: async ({ request, locals: { session, supabase } }) => {
    const formData = await request.formData()

    const notificationId = formData.get("id")

    if (!notificationId || typeof notificationId !== "string") {
      return fail(400, { error: "Invalid funding ID" })
    }
    if (!session?.user) {
      return fail(401, { error: "Please log in to bookmark this item" })
    }

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .eq("user_id", session.user.id)
    if (error) {
      return fail(400, { error: "Invalid funding ID" })
    }

    return { success: true }
  },
  socialLogin: async ({ url, request, locals: { session, supabase } }) => {
    const provider = url.searchParams.get("provider") as Provider
    const currentLocale = getLocale()
    console.log("currentLocale", currentLocale, "url", url)
    if (provider) {
      const redirectUrl = url.origin + `/${currentLocale}` + "/auth/callback"
      console.log("[redirectUrl]:", redirectUrl)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectUrl,
        },
      })
      if (error) {
        console.log(`${provider} login error`, error)
        return fail(400, { message: error.message })
      }
      if (data.url) {
        redirect(303, data.url)
      }
    }
    redirect(303, "/login/sign_in")
  },
  updateEmail2: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session, user, amr } = await safeGetSession()
    if (!session) {
      redirect(303, "/login")
    }
    const form = await superValidate(request, zod(ChangeEmailSchema))

    if (!form.valid) {
      return fail(400, { form })
    }
    const formData = form.data
    const email = formData.email
    const password = formData.password

    const { error, data: resss } = await supabase.auth.signInWithPassword({
      email: user?.email || "",
      password: password,
    })
    console.log("Current password check result", error, resss)

    if (error) {
      return message(form, error.message, {
        status: 403,
      })
    }

    const { error: upError, data } = await supabase.auth.updateUser({
      email: email,
    })
    if (upError) {
      console.error("Error updating password", error)

      return message(form, upError.message, {
        status: 404,
      })
    }
    console.log("[UpdateEmail] data", data)
    return {
      form,
      message: "Email updated successfully",
      status: 200,
    }
  },
  deleteAccount2: async ({
    request,
    locals: { supabase, supabaseServiceRole, safeGetSession },
  }) => {
    const { session, user } = await safeGetSession()
    if (!session || !user?.id) {
      redirect(303, "/login")
    }

    const form = await superValidate(request, zod(DeleteAccountSchema))

    const email = form.data.email
    const currentPassword = form.data.password
    const reason = form.data.reason
    if (email !== user.email) {
      form.message = "Email do not match with current login user."
      return fail(400, { form })
    }
    const { error: pwError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })
    if (pwError) {
      form.message = pwError.message
      return fail(400, { form })
    }
    await supabase.from("deleted_users").insert({
      user_id: user.id,
      deletion_reason: reason,
      full_name: user.user_metadata.full_name,
      email: user.email,
    })
    const { error } = await supabaseServiceRole.auth.admin.deleteUser(
      user.id,
      true,
    )
    if (error) {
      console.error("Error deleting user", error)
      form.message = error.message
      return fail(500, {
        form,
        errorMessage: "Unknown error. If this persists please contact us.",
        currentPassword,
      })
    }

    await supabase.auth.signOut()
    redirect(303, "/")
  },
  consultRequest: async ({
    request,
    locals: { session, supabaseServiceRole },
  }) => {
    const form = await superValidate(request, zod(ReqConsultForm))

    if (!session) {
      form.message = "User not Login"
      return fail(400, { form })
    }
    if (!form.valid) {
      form.message = "invalid Form"
      return fail(400, { form })
    }
    const userId = session.user.id
    const { email, name, message, program_id, program } = form.data
    const { error } = await supabaseServiceRole
      .from("consult_requests")
      .insert({
        email: email,
        name: name,
        message: message,
        funding_id: program_id,
        user_id: userId,
        program_title: program,
      })

    // const customUrl = `https://${MAIL_CHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAIL_CHIMP_AUDIENCE_ID}/members`

    // const response = await fetch(customUrl, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Basic ${Buffer.from(`anystring:${MAIL_CHIMP_API_KEY}`).toString("base64")}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email_address: email,
    //     status: "subscribed",
    //     tags: "cosult_req",
    //   }),
    // })
    // if (!response.ok) {
    //   const errorData = await response.json()
    //   console.log("errorData", errorData)
    //   form.message = errorData.detail || "Error sending mail. Try again."
    //   return fail(400, { form })
    // }

    if (error) {
      console.log("error", error)
      form.message =
        error.code === "23505"
          ? "Email already exist. Try another one."
          : error.message
      return fail(400, { form })
    }
    return { form }
  },
}
