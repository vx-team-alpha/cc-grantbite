import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import type { Database } from "../../../DatabaseDefinitions"
import type { FundingProgramWithTranslation } from "$lib/db_translation_helper"
import { getLocale } from "$lib/paraglide/runtime.js"
import {
  CompanySize,
  EligibleApplicantsShort,
  EligibleSectorsShort,
  FinancialInstrumentType,
  TargetStageShort,
} from "$lib/data_values/enums"
import { fail } from "@sveltejs/kit"
import type { Actions } from "./$types"

const ITEMS_PER_PAGE = 5

// Define a type for the items we expect from the joined tables
type FundingProgramItem = FundingProgramWithTranslation

// Updated type without bookmarks
type SupabaseJoinedResponse =
  Database["public"]["Tables"]["funding_main"]["Row"] & {
    funding_translations: Database["public"]["Tables"]["funding_translations"]["Row"][]
  }

// Define a type for the active filters
type ActiveFilters = Record<string, string | string[]>

// Helper function to parse filter values from URL
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

// Helper function to validate enum values
function validateEnumValues<T>(values: string[], enumObject: T): string[] {
  return values.filter((value) =>
    Object.values(enumObject as Record<string, string>).includes(value),
  )
}

// Helper function to apply filter to query
function applyFilterToQuery<T>(
  query: T,
  filterConfig: {
    values: string[]
    dbField: string
    useContainsOperator?: boolean
  },
): T {
  const { values, dbField, useContainsOperator = false } = filterConfig

  if (values.length === 0) {
    return query
  }

  type QueryWithMethods = T & {
    or: (conditions: string) => T
    in: (column: string, values: string[]) => T
  }

  const typedQuery = query as QueryWithMethods

  if (useContainsOperator) {
    return typedQuery.or(
      values.map((value) => `${dbField}.cs.{${value}}`).join(","),
    ) as T
  } else {
    return typedQuery.in(dbField, values) as T
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Helper function to flatten the joined response
function flattenJoinedResponse(
  items: SupabaseJoinedResponse[],
): FundingProgramItem[] {
  return items.map((item) => {
    const translation = item.funding_translations[0]
    if (!translation) {
      throw new Error(`No translation found for program ${item.id}`)
    }

    return {
      ...item,
      ...translation,
    } as FundingProgramItem
  })
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

  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  // Parse filter parameters from URL
  const activeFilters: ActiveFilters = {}

  // Define filter configurations
  const filterConfigs = [
    { id: "region", validate: false },
    { id: "company_size", validate: true, enumObject: CompanySize },
    {
      id: "financial_instrument",
      validate: true,
      enumObject: FinancialInstrumentType,
    },
    { id: "program_status", validate: false },
    {
      id: "eligible_applicants",
      validate: true,
      enumObject: EligibleApplicantsShort,
    },
    {
      id: "eligible_sectors",
      validate: true,
      enumObject: EligibleSectorsShort,
    },
    { id: "target_stages", validate: true, enumObject: TargetStageShort },
  ]

  // Process all filters
  for (const config of filterConfigs) {
    const values = parseFilterFromUrl(url.searchParams, config.id)

    if (values.length > 0) {
      const validValues = config.validate
        ? validateEnumValues(values, config.enumObject)
        : values

      if (validValues.length > 0) {
        activeFilters[config.id] = validValues
      }
    }
  }

  try {
    // Get current language
    const currentLanguage = getLocale()

    // First, get the user's bookmarked program IDs if logged in
    let bookmarkedProgramIds: string[] = []
    if (session?.user) {
      const { data: bookmarks, error: bookmarksError } =
        await supabaseServiceRole
          .from("bookmarks")
          .select("funding_id")
          .eq("user_id", session.user.id)

      if (bookmarksError) {
        throw bookmarksError
      }

      bookmarkedProgramIds = bookmarks.map((b) => b.funding_id)
    }

    // If user is not logged in or has no bookmarks, return empty results
    if (!session?.user || bookmarkedProgramIds.length === 0) {
      return {
        items: [],
        totalItems: 0,
        currentPage,
        itemsPerPage: ITEMS_PER_PAGE,
        searchQuery,
        activeFilters,
        session,
      }
    }

    // Now fetch only the bookmarked programs
    let query = supabaseServiceRole
      .from("funding_main")
      .select(
        `
        *,
        funding_translations!inner(*)
        `,
        { count: "exact" },
      )
      .eq("funding_translations.language", currentLanguage)
      .in("id", bookmarkedProgramIds) // Only fetch bookmarked programs

    // Apply search filter
    if (searchQuery) {
      query = query.ilike("funding_translations.title", `%${searchQuery}%`)
    }

    // Define query filter configurations
    const queryFilterConfigs = [
      {
        filterKey: "region",
        dbField: "funding_translations.overview_region",
        useContainsOperator: false,
      },
      {
        filterKey: "company_size",
        dbField: "overview_company_size",
        useContainsOperator: true,
      },
      {
        filterKey: "financial_instrument",
        dbField: "overview_financial_instrument",
        useContainsOperator: false,
      },
      {
        filterKey: "program_status",
        dbField: "program_status",
        useContainsOperator: false,
      },
      {
        filterKey: "eligible_applicants",
        dbField: "overview_eligible_applicants_short",
        useContainsOperator: true,
      },
      {
        filterKey: "eligible_sectors",
        dbField: "overview_eligible_sectors_short",
        useContainsOperator: true,
      },
      {
        filterKey: "target_stages",
        dbField: "overview_target_stages_short",
        useContainsOperator: true,
      },
    ]

    // Apply all filters to query
    for (const config of queryFilterConfigs) {
      const filterValues = activeFilters[config.filterKey]
      if (filterValues && Array.isArray(filterValues)) {
        query = applyFilterToQuery(query, {
          dbField: config.dbField,
          useContainsOperator: config.useContainsOperator,
          values: filterValues as string[],
        })
      }
    }

    // Apply ordering and pagination
    query = query
      .order("featured_priority", { ascending: false })
      .order("id", { ascending: false })
      .range(offset, offset + ITEMS_PER_PAGE - 1)

    const { data: items, error: dbError, count } = await query
    await sleep(20)
    if (dbError) {
      error(500, `Failed to fetch funding programs: ${dbError.message}`)
    }

    // Flatten the response
    const rawItems = (items as SupabaseJoinedResponse[]) || []
    const safeItems = flattenJoinedResponse(rawItems)

    // All returned items are bookmarked by definition
    const itemsWithBookmarks = safeItems.map((item) => ({
      ...item,
      bookmarked: true, // All items are bookmarked since we filtered by bookmarks
    }))

    return {
      items: itemsWithBookmarks,
      totalItems: count || 0,
      currentPage,
      itemsPerPage: ITEMS_PER_PAGE,
      searchQuery,
      activeFilters,
      session,
    }
  } catch (e: unknown) {
    const err = e as Error
    error(500, err.message || "An unexpected error occurred in load function")
  }
}

export const actions: Actions = {
  bookmark: async ({ request, locals: { session, supabase } }) => {
    const formData = await request.formData()
    const fundingId = formData.get("fundingId")

    if (!fundingId || typeof fundingId !== "string") {
      return fail(400, { error: "Invalid funding ID" })
    }
    if (!session?.user) {
      return fail(401, { error: "Please log in to bookmark this item" })
    }
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", session.user.id)
      .eq("funding_id", fundingId)

    if (error) {
      return fail(500, { error: error.message })
    }

    return { success: true }
  },
}
