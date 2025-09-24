import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import type { FundingProgramWithTranslation } from "$lib/db_translation_helper"
import { getLocale } from "$lib/paraglide/runtime.js"
import {
  fetchFundingPrograms,
  FILTER_CONFIGS,
  type FilterKey,
  type SafeActiveFilters,
} from "$src/lib/search/find_programs"

const ITEMS_PER_PAGE = 5

// Define a type for the items we expect from the joined tables
type FundingProgramItem = FundingProgramWithTranslation

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

export const load: PageServerLoad = async (event) => {
  const {
    url,
    locals: { supabaseServiceRole, session },
  } = event
  const rawSearchQuery = url.searchParams.get("q")
  const searchQuery = (rawSearchQuery || "").trim()
  const currentPage = parseInt(url.searchParams.get("page") || "1", 10)

  if (isNaN(currentPage) || currentPage < 1) {
    error(400, "Invalid page number")
  }

  // Parse filter parameters from URL
  const activeFilters: SafeActiveFilters = {}

  try {
    // Process all filters
    for (const key of Object.keys(FILTER_CONFIGS) as FilterKey[]) {
      const config = FILTER_CONFIGS[key]
      const values = parseFilterFromUrl(url.searchParams, key)

      if (values.length > 0) {
        // Validate values if needed
        const validValues = config.validate
          ? validateEnumValues(values, config.enum)
          : values

        if (validValues.length > 0) {
          // @ts-expect-error we do not do the casting here, but we could!
          activeFilters[key] = validValues
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
        itemsPerPage: ITEMS_PER_PAGE,
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
    return {
      items: enrichedItems,
      totalItems: totalItems || 0,
      currentPage,
      itemsPerPage: ITEMS_PER_PAGE,
      searchQuery, // Return the trimmed search query
      activeFilters, // Return the active filters
      session,
    }
  } catch (e: unknown) {
    const err = e as Error
    error(500, err.message || "An unexpected error occurred in load function")
  }
}
