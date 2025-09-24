import { ChangeEmailSchema } from "$lib/schemas/index.js"
import { fail } from "@sveltejs/kit"
import type { Actions } from "./$types.js"
import type { PageServerLoad } from "./$types.js"
import { superValidate } from "sveltekit-superforms/server"

import { zod } from "sveltekit-superforms/adapters"

export const load: PageServerLoad = async ({ locals }) => {
  return {
    session: locals.session ?? null,
    form: await superValidate(zod(ChangeEmailSchema)),
  }
}

export const actions: Actions = {
  default: async ({ request, locals: { supabase, session } }) => {
    const form = await superValidate(request, zod(ChangeEmailSchema))

    if (!form.valid) {
      return fail(400, { form })
    }
    if (!session) {
      form.message = "You must be logged in to change your password."
      return fail(401, { form })
    }
    const { data, error } = await supabase.auth.updateUser({
      email: form.data.email,
    })
    if (error) {
      form.message = error.message
      return fail(401, { form })
    }
    console.log("Validation successful! Saving data:", form.data)
    console.log("[ChangeMail] data", data)
    return { form }
  },
}
