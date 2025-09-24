import { ChangeCompanyAddress } from "$lib/schemas/index.js"
import type { PageServerLoad, Actions } from "./$types.js"
import { superValidate } from "sveltekit-superforms/server"
import { zod } from "sveltekit-superforms/adapters"
import { fail } from "@sveltejs/kit"

export const load: PageServerLoad = async ({
  locals: { session, supabase },
}) => {
  let initialData
  if (session) {
    const { data } = await supabase
      .from("profiles")
      .select(`company_address`)
      .eq("id", session.user.id)
      .single()

    if (data && data.company_address) {
      const company_address = data.company_address as {
        street?: string
        country?: string
        zipcode?: string
        city: string
      }
      initialData = {
        street: company_address.street ?? "",
        country: company_address.country ?? "",
        zipcode: company_address.zipcode ?? "",
        city: company_address.city ?? "",
      }
    } else {
      initialData = null
    }
  }
  const formValidate = initialData
    ? await superValidate(initialData, zod(ChangeCompanyAddress))
    : await superValidate(zod(ChangeCompanyAddress))
  return {
    session: session ?? null,
    form: formValidate,
  }
}

export const actions: Actions = {
  default: async ({ request, locals: { supabase, session } }) => {
    const form = await superValidate(request, zod(ChangeCompanyAddress))
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
        company_address: {
          country: form.data.country,
          city: form.data.city,
          street: form.data.street,
          zipcode: form.data.zipcode,
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
