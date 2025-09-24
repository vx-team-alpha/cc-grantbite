import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../../DatabaseDefinitions"
import type { FundingProgramWithTranslation } from "$lib/db_translation_helper"
import {
  CompanySize,
  Country,
  EligibleApplicantsShort,
  EligibleSectorsShort,
  FinancialInstrumentType,
  ProgramStatus,
  TargetStageShort,
} from "$lib/data_values/enums"
import { GoogleGenAI } from "@google/genai"
import { GEMINI_API_KEY } from "$env/static/private"
import { z } from "zod"

export type SupabaseJoinedResponse =
  Database["public"]["Tables"]["funding_translations"]["Row"] & {
    funding_main: Database["public"]["Tables"]["funding_main"]["Row"][]
  }
function applyFilterToQuery<T>(
  query: T,
  filterConfig: {
    values: string[]
    dbField: string
    useContainsOperator?: boolean
    referencedTable?: string
  },
): T {
  const { values, dbField, useContainsOperator = false } = filterConfig

  if (values.length === 0) {
    return query
  }

  // Use type assertion to tell TypeScript that the query has these methods
  type QueryWithMethods = T & {
    or: (conditions: string, params: object) => T
    in: (column: string, values: string[]) => T
  }

  const typedQuery = query as QueryWithMethods

  if (useContainsOperator) {
    // Use ANY operator for array fields with contains
    return typedQuery.or(
      values.map((value) => `${dbField}.cs.{${value}}`).join(","),
      filterConfig.referencedTable
        ? { referencedTable: filterConfig.referencedTable }
        : {},
    ) as T
  } else {
    // Use in operator for direct value matching
    return typedQuery.in(
      filterConfig.referencedTable
        ? `${filterConfig.referencedTable}.${dbField}`
        : dbField,
      values,
    ) as T
  }
}

export function flattenJoinedResponse(
  items: SupabaseJoinedResponse[],
): FundingProgramWithTranslation[] {
  return items.map((item) => {
    const main = item.funding_main
    if (!main) {
      throw new Error(`No main found for program ${item.id}`)
    }

    // Combine funding_main and funding_translations into a flat structure
    return {
      ...main,
      ...item,
    } as unknown as FundingProgramWithTranslation
  })
}

async function getCachedEmbedding(
  supabase: SupabaseClient<Database>,
  query: string,
): Promise<number[] | null> {
  if (query.length === 0) {
    return null
  }
  try {
    // try to get from cache
    const { data, error } = await supabase
      .from("embeddings_cache")
      .select("embedding")
      .eq("key", query)
      .single()

    if (!error && data.embedding) {
      return JSON.parse(data.embedding as string) as number[]
    }

    // get from gemini
    const gemini = new GoogleGenAI({ apiKey: GEMINI_API_KEY })
    const responseGemini = await gemini.models.embedContent({
      model: "gemini-embedding-exp-03-07",
      contents: query,
      config: {
        outputDimensionality: 3072, // 1536
      },
    })
    const [dataGemini] = responseGemini.embeddings || []
    const embedding = dataGemini.values
    if (embedding) {
      // add to cache
      const { error } = await supabase.from("embeddings_cache").insert({
        key: query,
        embedding: embedding,
      })
      if (error) {
        console.log("error inserting into cache", error)
      }
    }
    return embedding || null
  } catch (error) {
    console.log("something went wrong when getting the embedding: ", error)
    return null
  }
}

export const FILTER_CONFIGS = {
  countries: {
    validate: true,
    enum: Country,
    dbField: "overview_countries",
    useContains: true,
    referencedTable: "funding_main",
  },
  company_size: {
    validate: true,
    enum: CompanySize,
    dbField: "overview_company_size",
    useContains: true,
    referencedTable: "funding_main",
  },
  financial_instrument: {
    validate: true,
    enum: FinancialInstrumentType,
    dbField: "overview_financial_instrument",
    useContains: false,
    referencedTable: "funding_main",
  },
  program_status: {
    validate: true,
    enum: ProgramStatus,
    dbField: "program_status",
    useContains: false,
    referencedTable: "funding_main",
  },
  eligible_applicants: {
    validate: true,
    enum: EligibleApplicantsShort,
    dbField: "overview_eligible_applicants_short",
    useContains: true,
    referencedTable: "funding_main",
  },
  eligible_sectors: {
    validate: true,
    enum: EligibleSectorsShort,
    dbField: "overview_eligible_sectors_short",
    useContains: true,
    referencedTable: "funding_main",
  },
  target_stages: {
    validate: true,
    enum: TargetStageShort,
    dbField: "overview_target_stages_short",
    useContains: true,
    referencedTable: "funding_main",
  },
} as const
export type FilterKey = keyof typeof FILTER_CONFIGS
// export type SafeActiveFilters = Partial<Record<FilterKey, string[]>>
type EnumValues<E> = E[keyof E]
export type SafeActiveFilters = {
  -readonly [K in keyof typeof FILTER_CONFIGS]?: EnumValues<
    (typeof FILTER_CONFIGS)[K]["enum"]
  >[]
}

function enumValues<E extends Record<string, string>>(e: E) {
  return Object.values(e)
}

function getSafeActiveFiltersJsonSchema() {
  return {
    type: "object",
    properties: Object.fromEntries(
      Object.entries(FILTER_CONFIGS).map(([key, cfg]) => [
        key,
        {
          type: "array",
          items: { type: "string", enum: enumValues(cfg.enum) },
        },
      ]),
    ),
    additionalProperties: false,
  } as const
}
function getSafeActiveFiltersZodSchema() {
  return z.object(
    Object.fromEntries(
      Object.entries(FILTER_CONFIGS).map(([key, cfg]) => {
        const baseEnum = z.enum(enumValues(cfg.enum) as [string, ...string[]])
        return [key, z.array(baseEnum).optional()]
      }),
    ),
  )
}

export const ActiveFiltersJsonSchema = getSafeActiveFiltersJsonSchema()
export const ActiveFiltersZodSchema = getSafeActiveFiltersZodSchema()
// console.log(JSON.stringify(ActiveFiltersSchema, null, 2))

interface FetchFundingProgramsOptions {
  searchQuery: string
  activeFilters: SafeActiveFilters
  page: number
  itemsPerPage: number
  semanticMatchCount?: number
  semanticMatchThreshold?: number
}
/**
 * Fetches and filters funding programs from the database.
 * @param supabase - The Supabase client instance.
 * @param language - The language code for translations.
 * @param options - An object containing search, filter, and pagination options.
 * @returns An object with the list of items and the total count.
 */
export async function fetchFundingPrograms(
  supabase: SupabaseClient<Database>,
  language: string,
  {
    searchQuery,
    activeFilters,
    page,
    itemsPerPage,
    semanticMatchCount = 100,
    semanticMatchThreshold = 0.52,
  }: FetchFundingProgramsOptions,
) {
  const offset = (page - 1) * itemsPerPage

  // Start with a base query or an RPC call depending on the search query
  let query

  if (searchQuery) {
    // Attempt semantic search first
    const embedding = await getCachedEmbedding(supabase, searchQuery)

    if (embedding) {
      query = supabase
        .rpc(
          "match_documents",
          {
            query_embedding: embedding,
            match_threshold: semanticMatchThreshold,
            match_count: semanticMatchCount, // Get more results initially to allow for filtering
            target_language: language,
          },
          { count: "exact" },
        )
        .select("*,funding_main!inner(*)")
    } else {
      // Fallback to Full-Text Search
      query = supabase
        .rpc(
          "search_fts_funding",
          {
            query: searchQuery,
            target_language: language,
          },
          { count: "exact" },
        )
        .select("*,funding_main!inner(*)")
    }
  } else {
    // No search query, start with a standard select
    query = supabase
      .from("funding_translations")
      .select(`*, funding_main!inner(*)`, { count: "exact" })
      .eq("language", language)
  }

  // Apply all active filters to the query
  for (const key in activeFilters) {
    const filterKey = key as FilterKey
    const config = FILTER_CONFIGS[filterKey]
    const filterValues = activeFilters[filterKey]

    if (filterValues && filterValues.length > 0) {
      query = applyFilterToQuery(query, {
        dbField: config.dbField,
        useContainsOperator: config.useContains,
        values: filterValues,
        referencedTable: config.referencedTable,
      })
    }
  }

  // Apply pagination
  query = query.range(offset, offset + itemsPerPage - 1)

  // Execute the final query
  const { data, error: dbError, count } = await query

  if (dbError) {
    // Throw an error to be caught by the calling function
    throw new Error(`Failed to fetch funding programs: ${dbError.message}`)
  }

  // Flatten and return the results
  const rawItems = (data as unknown as SupabaseJoinedResponse[]) || []
  const safeItems = flattenJoinedResponse(rawItems)

  return {
    items: safeItems,
    totalItems: count || 0,
  }
}
