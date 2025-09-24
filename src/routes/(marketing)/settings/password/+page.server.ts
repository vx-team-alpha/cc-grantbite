import { ChangePasswordSchema } from "$lib/schemas/index.js"
import { fail, redirect } from "@sveltejs/kit"
import type { Actions } from "./$types.js"
import type { PageServerLoad } from "./$types.js"
import { superValidate } from "sveltekit-superforms/server"

import { zod } from "sveltekit-superforms/adapters"

export const load: PageServerLoad = async ({ locals: { session } }) => {
  if (session && session.user.app_metadata.provider != "email")
    redirect(308, "/settings")
  return {
    session: session ?? null,
    form: await superValidate(zod(ChangePasswordSchema)),
  }
}

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(ChangePasswordSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    console.log("Validation successful! Saving data:", form.data)

    return { form }
  },
}
