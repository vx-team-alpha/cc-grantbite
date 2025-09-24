import type { RequestHandler } from "./$types"
import {
  flattenJoinedResponse,
  type SupabaseJoinedResponse,
} from "$src/lib/search/find_programs"
import { pickSearchResultItem } from "$src/lib/db_translation_helper"
import { json } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ request, locals }) => {
  const { session, user } = await locals.safeGetSession()
  if (!session) {
    // console.log("no session...")
  }

  const { permalinks } = (await request.json()) as { permalinks: string[] }
  const { data, error } = await locals.supabaseServiceRole
    .from("funding_translations")
    .select(`*, funding_main!inner(*)`, { count: "exact" })
    .in("permalink", permalinks)

  if (data && !error) {
    const rawItems = (data as unknown as SupabaseJoinedResponse[]) || []
    const safeItems = flattenJoinedResponse(rawItems)
    const searchResults = safeItems.map(pickSearchResultItem)
    return json({ data: searchResults, error: null })
  }

  return json({ data: [], error: JSON.stringify(error) })
}
