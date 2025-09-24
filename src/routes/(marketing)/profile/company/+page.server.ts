import { ChangeCompanyDetails } from "$lib/schemas/index.js"
import { fail } from "@sveltejs/kit"
import type { Actions } from "./$types.js"
import type { PageServerLoad } from "./$types.js"
import { superValidate } from "sveltekit-superforms/server"
import { zod } from "sveltekit-superforms/adapters"

export const load: PageServerLoad = async ({
  locals: { supabase, session },
}) => {
  let initialData
  if (session) {
    const { data } = await supabase
      .from("profiles")
      .select(`company_info, company_name`)
      .eq("id", session.user.id)
      .single()

    if (data && data.company_info) {
      const companyDetails = data.company_info as {
        company_name?: string
        registration_no?: string
        company_type?: string
        [key: string]: unknown
      }
      initialData = {
        name: data.company_name ?? companyDetails?.company_name ?? "",
        registrationNo: companyDetails.registration_no ?? "",
        type: companyDetails.company_type ?? "",
      }
      // }
      //  else {
      //   initialData = {
      //     name: (data && data.company_name) ?? "",
      //     registrationNo: undefined,
      //     type: undefined,
      //   }
    }
  }

  return {
    session: session ?? null,
    form: await superValidate(initialData, zod(ChangeCompanyDetails)),
  }
}

export const actions: Actions = {
  default: async ({ request, locals: { supabase, session } }) => {
    const form = await superValidate(request, zod(ChangeCompanyDetails))
    console.log("form", form.data)
    if (!form.valid) {
      return fail(400, { form })
    }

    if (!session) {
      form.message = "You must be logged in to change your company details."
      return fail(400, { form })
    }
    const { error } = await supabase
      .from("profiles")
      .update({
        company_name: form.data.name,
        company_info: {
          company_name: form.data.name,
          registration_no: form.data.registrationNo,
          company_type: form.data.type,
        },
      })
      .eq("id", session.user.id)
    if (error) {
      console.error("Error updating company details:", error)
      form.message =
        error.message || "An error occurred while updating company details."
      return fail(500, { form })
    }
    return { form }
  },
}
