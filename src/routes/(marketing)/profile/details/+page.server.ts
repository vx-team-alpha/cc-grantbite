import { ChangeCompanyDetailsEmp } from "$lib/schemas/index.js"
import { fail } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types.js"
import { superValidate } from "sveltekit-superforms/server"

import { zod } from "sveltekit-superforms/adapters"

export const load: PageServerLoad = async ({
  locals: { supabase, session },
}) => {
  let initialData
  if (session) {
    const { data } = await supabase
      .from("profiles")
      .select(`company_details`)
      .eq("id", session.user.id)
      .single()

    if (data && data.company_details) {
      const companyDetails = data.company_details as {
        revenue?: string
        founded_year?: string
        employees?: string[]
      }
      initialData = {
        foundedYear: companyDetails.founded_year,
        numberEmployee: companyDetails.employees
          ? [
              Number(companyDetails.employees[0]),
              Number(companyDetails.employees[1]),
            ]
          : [20, 50],
        revenueLastYear: companyDetails.revenue,
      }
    } else {
      initialData = null
    }
  }
  const formValidate = initialData
    ? await superValidate(initialData, zod(ChangeCompanyDetailsEmp))
    : await superValidate(zod(ChangeCompanyDetailsEmp))
  return {
    session: session ?? null,
    form: formValidate,
  }
}

export const actions: Actions = {
  default: async ({ request, locals: { supabase, session } }) => {
    const form = await superValidate(request, zod(ChangeCompanyDetailsEmp))
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
        company_details: {
          founded_year: form.data.foundedYear,
          employees: form.data.numberEmployee,
          revenue: form.data.revenueLastYear,
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
