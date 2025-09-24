import { error, redirect, type ServerLoadEvent } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import type { FundingProgramWithTranslation } from "$lib/db_translation_helper"
import { getLocale } from "$lib/paraglide/runtime.js"
import { getProgramTranslationsAndPreferred } from "$lib/db_translation_helper"
import { processMarkdown } from "$src/lib/components/sections/detail-page/markdown-preprocessing"
import MarkdownAccordion from "$lib/components/markdown-accordion-test.svelte"
import { render } from "svelte/server"
import { max_number_similar_programs } from "$src/config"

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
  const {
    params,
    locals: { supabaseServiceRole, session }, // <-- Include session
    url,
  } = event

  const targetPermalink = params.permalink!
  const currentLanguage = getLocale()

  // Get translations and preferred entry
  const translationsResult = await getProgramTranslationsAndPreferred(
    supabaseServiceRole,
    targetPermalink,
    currentLanguage,
  )

  if (!translationsResult) {
    throw error(404, {
      message: `Funding program with permalink "${targetPermalink}" not found.`,
    })
  }

  const { availableLanguageCombinations, preferredEntry } = translationsResult

  if (!preferredEntry) {
    throw error(404, {
      message: `Funding program data not found.`,
    })
  }

  const programId = preferredEntry.id
  const translation = preferredEntry
  const isUsingFallback = translation.language !== currentLanguage
  const fallbackLanguage = isUsingFallback ? translation.language : null

  // Redirect to correct permalink if needed
  if (!isUsingFallback && translation.permalink !== targetPermalink) {
    throw redirect(
      302,
      url.pathname.replace(targetPermalink, translation.permalink),
    )
  }

  // Fetch main funding program data
  const { data: mainData, error: mainError } = await supabaseServiceRole
    .from("funding_main")
    .select("*")
    .eq("id", programId)
    .single()

  if (mainError || !mainData) {
    console.error(
      `Error fetching main program data for ID "${programId}":`,
      mainError,
    )
    throw error(404, {
      message: `Funding program data not found.`,
    })
  }

  // Merge translation and mainData
  const program: FundingProgramWithTranslation = {
    ...mainData,
    ...translation,
  }

  let bookmarked = false
  if (session?.user?.id) {
    const { data: bookmarks, error: bmError } = await supabaseServiceRole
      .from("bookmarks")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("funding_id", program.id)
      .single()

    if (bmError) {
      console.error("Error checking bookmark:", bmError.message)
    } else {
      bookmarked = !!bookmarks
    }
  }

  let similar_programs: { title: string; permalink: string }[] = []
  if (program.embedding) {
    const { data: similar_programs_data, error: similar_programs_error } =
      await supabaseServiceRole
        .rpc("match_documents", {
          query_embedding: program.embedding, // pass the query embedding
          match_threshold: 0.52, // choose an appropriate threshold for your data
          match_count: max_number_similar_programs + 1, // we need to exclude ourselves
          target_language: currentLanguage,
        })
        .select("title,permalink")
        // @ts-expect-error this is supabase bug: https://github.com/supabase/supabase-js/issues/1365
        .neq("permalink", program.permalink)
    if (similar_programs_data && !similar_programs_error) {
      similar_programs = similar_programs_data
    }
  }

  // Add bookmarked flag to program
  const programWithBookmark = {
    ...program,
    bookmarked,
  }

  // SEO metadata
  const meta = {
    title: program.title || "Funding Program Details",
    description:
      program.introduction_short ||
      `Learn more about the ${program.title || "funding program"}.`,
  }

  // Markdown processing
  const markdownContent = processMarkdown(program.md_content || "")
  const markdownPrerendered = render(MarkdownAccordion, {
    props: {
      markdownContent,
    },
  }).body

  return {
    markdownContent,
    markdownPrerendered,
    program: programWithBookmark, // <-- Return enriched program
    meta,
    session,
    isUsingFallback,
    fallbackLanguage,
    currentLanguage,
    availableLanguageCombinations,
    lastUpdated: translation.updated_at,
    similar_programs,
  }
}
