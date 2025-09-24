import { DeleteAccountSchema } from "$lib/schemas/index.js"
import { fail } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"
import { superValidate } from "sveltekit-superforms/server"

import { zod } from "sveltekit-superforms/adapters"

export const load: PageServerLoad = async ({ locals }) => {
  return {
    session: locals.session ?? null,
    form: await superValidate(zod(DeleteAccountSchema)),
  }
}

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(DeleteAccountSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    console.log("Validation successful! Saving data:", form.data)

    return { form }
  },
}
