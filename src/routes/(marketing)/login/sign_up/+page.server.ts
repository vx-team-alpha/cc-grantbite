import { SignInForm, SignUpForm } from "$lib/schemas/index.js"
import type { PageServerLoad, Actions } from "./$types.js"
import { superValidate } from "sveltekit-superforms/server"
import { zod } from "sveltekit-superforms/adapters"
import { fail, redirect } from "@sveltejs/kit"
import { localizeHref } from "$src/lib/paraglide/runtime.js"

export const load: PageServerLoad = async ({ locals }) => {
  return {
    session: locals.session ?? null,
    SignInform: await superValidate(zod(SignInForm)),
    SignUpform: await superValidate(zod(SignUpForm)),
  }
}

export const actions: Actions = {
  signIn: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(SignInForm))
    if (!form.valid) {
      return fail(400, { form })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.data.email,
      password: form.data.password,
    })
    if (error) {
      form.message = error.message
      return fail(400, { form })
    }

    console.log("Supabase signUp response:", data, error)

    return { form }
  },
  signUp: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(SignUpForm))
    if (!form.valid) {
      return fail(400, { form })
    }

    const url = new URL(request.url)
    console.log(`${url.origin}${localizeHref(`/auth/callback`)}`)
    const { data, error } = await supabase.auth.signUp({
      email: form.data.email,
      password: form.data.password,
      options: {
        data: {
          first_name: form.data.firstName,
          last_name: form.data.lastName,
        },
        emailRedirectTo: `${url.origin}${localizeHref(`/auth/callback`)}`,
      },
    })
    console.log("Supabase signUp response:", data, error)

    if (error) {
      form.message = error.message
      return fail(400, { form })
    }

    console.log("Supabase signUp response:", data, error)
    if (error) {
      return fail(400, { form: form, error: error })
    }
    console.log("Validation successful! Saving data:", form.data)
    redirect(308, localizeHref("/funding"))
    return { form }
  },
}
