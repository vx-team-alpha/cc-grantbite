import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase, session },
}) => {
  if (session) {
    const { data } = await supabase
      .from("profiles")
      .select(`*`)
      .eq("id", session.user.id)
      .single()
    console.log("[Profile] data", data)
    return {
      session: session ?? null,
      data: { ...data },
    }
  }
  return {
    session: session ?? null,
  }
}
