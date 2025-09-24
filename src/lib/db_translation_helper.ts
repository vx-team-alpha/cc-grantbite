// Place in src/lib/types.ts
import type { Database, Tables } from "../DatabaseDefinitions" // Adjust the import path as needed
import type { SupabaseClient } from "@supabase/supabase-js"

export type FundingProgramWithTranslation = Tables<"funding_main"> &
  Tables<"funding_translations"> & {
    bookmarked?: boolean
    bookmarks?: {
      user_id: string
    }[]
  }

export const searchResultItemKeys = [
  "updated_at",
  "title",
  "introduction_short",
  "overview_maximum_funding_amount",
  "overview_financial_instrument",
  "overview_deadline",
  "overview_open_until",
  "overview_region",
  "overview_eligible_sectors_short",
  "overview_beneficiary",
  "provider_funding_body",
  "provider_managed_by",
  "permalink",
  "program_status",
  "featured_priority",
  "id",
  "bookmarked",
] as const
// Type for the search result card - using relevant fields from the joined type
export type SearchResultItem = Pick<
  FundingProgramWithTranslation,
  (typeof searchResultItemKeys)[number]
>
export function pickSearchResultItem(
  obj: FundingProgramWithTranslation,
): SearchResultItem {
  return searchResultItemKeys.reduce((res, key) => {
    // @ts-expect-error not typing the accumaltor here
    res[key] = obj[key]
    return res
  }, {} as SearchResultItem)
}

export type FundingNotifications = {
  name: string
  stage: string
  useOfFunds: string[]
  term: string
  budget: string
  fundingProgramsFound: number
}

export interface FundingContact {
  name?: string
  subtitle?: string
  address?: string
  phone?: string
  fax?: string
  email?: string
  website?: { url: string; name: string }
}

// Language fallback priority constants
export const LANGUAGE_FALLBACK_PRIORITY = [
  "en",
  "de",
  "es",
  "fr",
  "pt",
] as const

export type ProgramTranslationCombination = {
  id: string
  permalink: string
  language: string
}

export type ProgramTranslationsResult = {
  availableLanguageCombinations: ProgramTranslationCombination[]
  preferredEntry: Tables<"funding_translations"> | null
}

export async function getProgramTranslationsAndPreferred(
  supabase: SupabaseClient<Database>,
  inputPermalink: string,
  preferredLanguage: string,
): Promise<ProgramTranslationsResult | null> {
  // Query 1: Find the program ID by the input permalink (any language)
  const { data: permalinkData, error: permalinkError } = await supabase
    .from("funding_translations")
    .select("id")
    .eq("permalink", inputPermalink)
    .single()

  if (permalinkError || !permalinkData) {
    return null // Permalink doesn't exist in any language
  }

  const programId = permalinkData.id

  // Query 2: Get all id, permalink, language combinations for this program
  const { data: combinationsData, error: combinationsError } = await supabase
    .from("funding_translations")
    .select("id, permalink, language")
    .eq("id", programId)

  if (combinationsError || !combinationsData || combinationsData.length === 0) {
    return null // No translations exist for the program
  }

  const availableLanguageCombinations: ProgramTranslationCombination[] =
    combinationsData

  // Determine the best available language using fallback logic
  let targetLanguage = preferredLanguage
  let languageFound = false

  // Check if preferred language is available
  if (
    availableLanguageCombinations.some(
      (combo) => combo.language === preferredLanguage,
    )
  ) {
    languageFound = true
  } else {
    // Try fallback languages in priority order
    for (const fallbackLang of LANGUAGE_FALLBACK_PRIORITY) {
      if (
        availableLanguageCombinations.some(
          (combo) => combo.language === fallbackLang,
        )
      ) {
        targetLanguage = fallbackLang
        languageFound = true
        break
      }
    }
  }

  if (!languageFound) {
    return {
      availableLanguageCombinations,
      preferredEntry: null,
    }
  }

  // Query 3: Get the full entry for the target language
  const { data: preferredEntry, error: preferredError } = await supabase
    .from("funding_translations")
    .select("*")
    .eq("id", programId)
    .eq("language", targetLanguage)
    .single()

  if (preferredError || !preferredEntry) {
    return {
      availableLanguageCombinations,
      preferredEntry: null,
    }
  }

  return {
    availableLanguageCombinations,
    preferredEntry,
  }
}

export type CompanyInfo = {
  company_name: string
  company_type: string
  registration_no: string
}

export type CompanyAddress = {
  area: string
  city: string
  street: string
  zipcode: string
}

export type CompanyDetails = {
  revenue: string
  employees: [number, number]
  founded_year: string
}
