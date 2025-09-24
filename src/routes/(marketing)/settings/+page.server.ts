import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase, session, user },
}) => {
  if (session) {
    const { data } = await supabase
      .from("profiles")
      .select(`*`)
      .eq("id", session.user.id)
      .single()
    const userDetails = {
      ...data,
      provider: session.user?.identities?.[0]?.provider || "",
    }
    return {
      session: session ?? null,
      data: userDetails,
      user,
    }
  }
  return {
    session: session ?? null,
    user,
  }
}
