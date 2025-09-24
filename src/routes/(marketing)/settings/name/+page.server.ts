import { ChangeNameFormSchema } from "$lib/schemas/index.js"
import { fail } from "@sveltejs/kit"
import type { Actions } from "./$types.js"
import type { PageServerLoad } from "./$types.js"
import { superValidate } from "sveltekit-superforms/server"

import { zod } from "sveltekit-superforms/adapters"
export const load: PageServerLoad = async ({
  locals: { supabase, session },
}) => {
  if (session) {
    const { data } = await supabase
      .from("profiles")
      .select(`first_name , last_name`)
      .eq("id", session.user.id)
      .single()

    const intialValue = {
      firstName: `${data?.first_name || ""}`,
      lastName: `${data?.last_name || ""}`,
    }
    return {
      session: session ?? null,
      form: await superValidate(intialValue, zod(ChangeNameFormSchema)),
    }
  }
  return {
    session: session ?? null,
    form: await superValidate(zod(ChangeNameFormSchema)),
  }
}

export const actions: Actions = {
  default: async ({ request, locals: { supabase, session } }) => {
    const form = await superValidate(request, zod(ChangeNameFormSchema))

    if (!form.valid) {
      return fail(400, { form })
    }
    if (!session?.user) {
      form.message = "You must be logged in to change your name."
      return fail(400, { form })
    }
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.data.firstName + " " + form.data.lastName,
        first_name: form.data.firstName,
        last_name: form.data.lastName,
      })
      .eq("id", session?.user.id)
    if (error) {
      form.message = error.message
      return fail(400, { form })
    }
    console.log("Validation successful! Saving data:", form.data)

    return { form }
  },
}
