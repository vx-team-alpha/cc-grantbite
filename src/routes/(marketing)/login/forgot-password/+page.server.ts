import { ForgotPassword } from "$lib/schemas/index.js"
import type { PageServerLoad, Actions } from "./$types.js"
import { superValidate } from "sveltekit-superforms/server"
import { zod } from "sveltekit-superforms/adapters"
import { fail } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ locals }) => {
  return {
    session: locals.session ?? null,
    ForgotPassword: await superValidate(zod(ForgotPassword)),
  }
}
export const actions: Actions = {
  forgotPassword: async ({ request, locals: { supabase }, url }) => {
    const form = await superValidate(request, zod(ForgotPassword))

    if (!form.valid) {
      return fail(400, { form })
    }

    const { email } = form.data

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${url.origin}/auth/callback?next=%2Faccount%2Fsettings%2Freset_password`,
    })

    if (error) {
      form.message = error.message
      return fail(400, { form })
    }

    console.log("Supabase resetPasswordForEmail response:", data)

    return {
      form,
      sentEmail: true,
    }
  },
}
