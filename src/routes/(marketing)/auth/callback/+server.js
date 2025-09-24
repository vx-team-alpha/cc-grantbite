// src/routes/auth/callback/+server.js
import { redirect } from "@sveltejs/kit"
import { isAuthApiError } from "@supabase/supabase-js"
import { localizeHref } from "$src/lib/paraglide/runtime.js"

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") ?? "/"

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        console.log("[next]: ", next)

        throw redirect(303, localizeHref("/funding"))
        // throw redirect(303, `/${next.slice(1)}`)
      }
    } catch (err) {
      // If you open in another browser, need to redirect to login.
      // Should not display error
      if (isAuthApiError(err)) {
        redirect(303, "/login/sign_in?verified=true")
      } else {
        throw err
      }
    }
  }
  throw redirect(303, "/login/sign_in?verified=true")
}
