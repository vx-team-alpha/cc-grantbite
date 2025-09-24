import type { PageServerLoad } from "./$types.js"

export const load: PageServerLoad = async ({
  params,

  locals: { session, supabase },
}) => {
  const notificationId = params.notification_id

  if (!session) {
    return {
      session: null,
      notifications: [],
    }
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", session?.user.id)
    .eq("id", notificationId)
    .order("created_at", { ascending: false })

  if (error) {
    return {
      session: null,
      notifications: [],
    }
  }
  return {
    session: session,
    notifications: data,
  }
}
