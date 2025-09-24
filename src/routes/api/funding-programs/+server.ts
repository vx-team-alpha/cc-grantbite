import { json, error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { getLocale } from "$lib/paraglide/runtime"
import { fetchFundingPrograms } from "$src/lib/search/find_programs"
import type { FundingProgramWithTranslation } from "$src/lib/db_translation_helper"
import type { SafeActiveFilters } from "$src/lib/search/find_programs"
import { FILTER_CONFIGS } from "$src/lib/search/find_programs"
import type { FilterKey } from "$src/lib/search/find_programs"

function parseFilterFromUrl(
  searchParams: URLSearchParams,
  filterId: string,
  sanitize = true,
): string[] {
  const values = searchParams.getAll(filterId)
  if (sanitize) {
    return values.map((t) => t?.replace(/[^a-zA-Z0-9 _-]/g, ""))
  }
  return values
}

function validateEnumValues<T>(values: string[], enumObject: T): string[] {
  return values.filter((value) =>
    Object.values(enumObject as Record<string, string>).includes(value),
  )
}

type FundingProgramItem = FundingProgramWithTranslation

export const GET: RequestHandler = async ({ url, locals }) => {
  const { supabaseServiceRole, session } = locals

  const rawSearchQuery = url.searchParams.get("q")
  const searchQuery = (rawSearchQuery || "").trim()
  const currentPage = parseInt(url.searchParams.get("page") || "1", 10)

  if (isNaN(currentPage) || currentPage < 1) {
    error(400, "Invalid page number")
  }

  // Parse filter parameters from URL
  const activeFilters: SafeActiveFilters = {}

  try {
    // Process all filters - reuse your existing logic
    for (const key of Object.keys(FILTER_CONFIGS) as FilterKey[]) {
      const config = FILTER_CONFIGS[key]
      const values = parseFilterFromUrl(url.searchParams, key)

      if (values.length > 0) {
        // Validate values if needed
        const validValues = config.validate
          ? validateEnumValues(values, config.enum)
          : values

        if (validValues.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          activeFilters[key] = validValues as any
        }
      }
    }

    // Get current language
    const currentLanguage = getLocale()
    const { items: safeItems, totalItems } = await fetchFundingPrograms(
      supabaseServiceRole,
      currentLanguage,
      {
        searchQuery,
        activeFilters,
        page: currentPage,
        itemsPerPage: 5,
      },
    )

    // Bulk fetch bookmarks for current user
    let bookmarkedIds: string[] = []
    if (session?.user?.id && safeItems.length) {
      const ids = safeItems.map((i) => i.id)
      const { data: bms, error: bmErr } = await supabaseServiceRole
        .from("bookmarks")
        .select("*")
        .in("funding_id", ids)
        .eq("user_id", session.user.id)
      if (bmErr) console.error("Bookmark fetch error:", bmErr.message)
      else bookmarkedIds = bms.map((b) => b.funding_id)
    }

    const enrichedItems: FundingProgramItem[] = safeItems.map((item) => ({
      ...item,
      bookmarked: session?.user?.id ? bookmarkedIds.includes(item.id) : false,
    }))

    // Return JSON response
    return json({
      items: enrichedItems,
      totalItems: totalItems || 0,
      currentPage,
      itemsPerPage: 5,
      searchQuery,
      activeFilters,
    })
  } catch (e: unknown) {
    const err = e as Error
    console.error("API Error:", err)
    error(500, err.message || "An unexpected error occurred in API handler")
  }
}
