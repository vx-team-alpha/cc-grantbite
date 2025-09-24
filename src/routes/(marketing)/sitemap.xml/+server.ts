import type { RequestHandler } from "@sveltejs/kit"
import * as sitemap from "super-sitemap"
import { WebsiteBaseUrl } from "../../../config"
import { locales, localizeHref } from "$lib/paraglide/runtime"
import { fetchAllWithBuilder } from "$lib/utils"
import type { FundingProgramWithTranslation } from "$lib/db_translation_helper"

export const prerender = true

function fixBaseEntry(url: string) {
  if (url.endsWith("/")) {
    for (let index = 0; index < locales.length; index++) {
      const lang = locales[index]
      if (url === `/${lang}/`) {
        return `/${lang}`
      }
    }
  }
  return url
}

export const GET: RequestHandler = async ({ locals }) => {
  const supabase = locals.supabaseServiceRole

  const excludeRoutePatterns = [
    ".*\\(admin\\).*", // i.e. exclude routes within admin group
    "/session",
    "/login",
    "/notifications",
    "/bookmarks",
    "/pricing",
    "/profile",
    "/settings",
    "/contact_us",
  ]

  const { data, error } =
    await fetchAllWithBuilder<FundingProgramWithTranslation>(
      supabase,
      (sb) =>
        sb
          .from("funding_translations")
          .select("id,language,permalink,updated_at")
          .order("id", { ascending: false })
          .order("language")
          .not("permalink", "is", null),
      1000,
    )

  if (error || !data) {
    console.error("Error fetching permalinks for sitemap:", error)
    // Depending on how critical the sitemap is, you might want to return an error response
    // or just generate a sitemap without the dynamic routes. For now, we'll proceed
    // without the dynamic routes if there's an error.
    return await sitemap.response({
      origin: WebsiteBaseUrl,
      excludeRoutePatterns: excludeRoutePatterns,
    })
  }

  const funding_links = data.reduce(
    (acc, { id, ...rest }) => {
      acc[id] = acc[id] || []
      acc[id].push(rest)
      return acc
    },
    {} as Record<
      string,
      {
        language: string
        permalink: string
        updated_at: string
      }[]
    >,
  )
  const funding_permalink_lookup = Object.fromEntries(
    data.map((x) => [
      x.permalink,
      { language: x.language, id: x.id, updated_at: x.updated_at },
    ]),
  )
  const languagePriority = { en: 0, de: 1 }
  Object.keys(funding_links).forEach((id) => {
    funding_links[id].sort((a, b) => {
      const priorityA =
        languagePriority[a.language as keyof typeof languagePriority] ?? 999
      const priorityB =
        languagePriority[b.language as keyof typeof languagePriority] ?? 999
      return priorityA - priorityB
    })
  })

  return await sitemap.response({
    origin: WebsiteBaseUrl,
    excludeRoutePatterns: excludeRoutePatterns,
    paramValues: {
      // "/funding/[permalink]": permalinkValues,
      "/funding/[permalink]": Object.keys(funding_permalink_lookup),
    },
    processPaths: (paths) => {
      return paths.map(({ path, ...rest }) => {
        if (path.startsWith("/funding/")) {
          const permalink = path.split("/")[2]
          console.log("[permalink]->", permalink)
          const { id, language, updated_at } =
            funding_permalink_lookup[permalink]
          const links = funding_links[id]
          const x_default = links[0]
          const first = links.filter((t) => t.language == language)[0]
          const rest = links.filter((t) => t.language != language)
          const alternates = rest.map((d) => ({
            lang: d.language,
            path: localizeHref(`/funding/${d.permalink}`, {
              locale: d.language,
            }),
          }))
          alternates.push({
            lang: "x-default",
            path: localizeHref(`/funding/${x_default.permalink}`, {
              locale: x_default.language,
            }),
          })
          const result = {
            path: localizeHref(`/funding/${first.permalink}`, {
              locale: first.language,
            }),
            alternates: alternates,
            lastmod: updated_at,
          }

          return result
        } else {
          return {
            ...rest,
            path: fixBaseEntry(localizeHref(path, { locale: "en" })),
            alternates: [
              {
                lang: "de",
                path: fixBaseEntry(localizeHref(path, { locale: "de" })),
              },
              {
                lang: "es",
                path: fixBaseEntry(localizeHref(path, { locale: "es" })),
              },
              {
                lang: "pt",
                path: fixBaseEntry(localizeHref(path, { locale: "pt" })),
              },
              {
                lang: "fr",
                path: fixBaseEntry(localizeHref(path, { locale: "fr" })),
              },
            ],
          }
        }
      })
    },
  })
}
