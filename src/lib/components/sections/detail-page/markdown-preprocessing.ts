import { marked, type Token, type Tokens } from "marked"
import { slugify } from "$lib/utils"
// import DOMPurify from "dompurify"
// import { JSDOM } from "jsdom"
import sanitizeHtmlPurify from "sanitize-html"

interface AccordionSection {
  type: "accordion"
  title: string
  content: string
  id: string
  level: number
}

interface RegularSection {
  type: "regular"
  content: string
  id?: string // Optional ID for regular sections
  tokenType?: string
}

type ContentSection = AccordionSection | RegularSection

const offsetMarkdownHeadingLevels = 1 // Adjust this if you want to change the heading levels
const accordionLevel = 3 // Level at which headings become accordion sections
/**
 * Sanitizes HTML content using DOMPurify
 * @param html Raw HTML string
 * @returns Sanitized HTML string
 */
function sanitizeHtml(html: string): string {
  // const window = new JSDOM("").window
  // const purify = DOMPurify(window)
  // const sanitizedHtml = purify.sanitize
  return sanitizeHtmlPurify(html, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "strong",
      "em",
      "u",
      "i",
      "b",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "a",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    // allowedAttributes: {
    //   ""
    // },
  })
}

/**
 * Renders a subset of tokens as HTML
 * @param tokens Array of tokens to render
 * @returns Sanitized HTML string
 */

function renderTokensAsHtml(tokens: Token[]): string {
  if (tokens.length === 0) return ""

  let tempMarkdown = ""

  tokens.forEach((token) => {
    if (token.type === "heading") {
      // console.log("Rendering heading token:", token)
      const hashes = "#".repeat(token.depth + offsetMarkdownHeadingLevels)
      const text = token.text ?? ""
      tempMarkdown += `${hashes} ${text}\n\n`
    } else if (token.type === "paragraph") {
      const text = token.text ?? ""
      tempMarkdown += `${text}\n\n`
    } else if (token.type === "code") {
      const fence = "```"
      const lang = token.lang ?? ""
      const text = token.text ?? ""
      tempMarkdown += `${fence}${lang}\n${text}\n${fence}\n\n`
    } else if (token.type === "list") {
      const listToken = token as Tokens.List
      listToken.items.forEach((item) => {
        const text = item.text ?? ""
        tempMarkdown += `- ${text}\n`
      })
      tempMarkdown += "\n"
    } else if (token.raw) {
      tempMarkdown += `${token.raw}\n`
    }
  })

  const rawHtml = marked.parse(tempMarkdown)
  // Handle both sync and async returns from marked.parse
  if (typeof rawHtml === "string") {
    return sanitizeHtml(rawHtml)
  } else {
    // This shouldn't happen in our use case, but handle it gracefully
    return ""
  }
}

/**
 * Process markdown tokens to create accordion and regular sections
 * @param tokens Array of tokens from marked.lexer
 */
function processTokens(tokens: Token[]) {
  let contentSections: ContentSection[] = []
  let openSections: Record<string, boolean> = {}
  const sections: ContentSection[] = []
  let currentAccordionSectionTitle: string | null = null
  let currentAccordionContentTokens: Token[] = []
  let currentRegularContentTokens: Token[] = []
  let currentAccordionLevel: number | null = null

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    if (token.type === "heading") {
      const headingToken = token as Tokens.Heading
      const headingLevel = headingToken.depth + offsetMarkdownHeadingLevels
      // console.log(
      //   `Processing heading:   (level: ${headingLevel}) ${headingToken.text} `,
      //   headingLevel <= accordionLevel,
      // )
      if (headingLevel <= accordionLevel) {
        if (currentRegularContentTokens.length > 0) {
          sections.push({
            type: "regular",
            content: renderTokensAsHtml(currentRegularContentTokens),
          })
          currentRegularContentTokens = []
        }

        if (currentAccordionSectionTitle !== null) {
          sections.push({
            type: "accordion",
            title: currentAccordionSectionTitle,
            content: renderTokensAsHtml(currentAccordionContentTokens),
            id: slugify(currentAccordionSectionTitle), // Use slugify here
            level: currentAccordionLevel || accordionLevel,
          })
          currentAccordionContentTokens = []
          currentAccordionSectionTitle = null
          currentAccordionLevel = null
        }

        if (headingLevel === accordionLevel) {
          currentAccordionSectionTitle = headingToken.text ?? ""
          currentAccordionLevel = headingLevel
        } else {
          const headingHtml = renderTokensAsHtml([headingToken])
          sections.push({
            tokenType: "heading",
            type: "regular",
            content: headingHtml,
            id: slugify(headingToken.text ?? ""), // Use slugify here
          })
        }
      } else {
        if (currentAccordionSectionTitle !== null) {
          currentAccordionContentTokens.push(token)
        } else {
          currentRegularContentTokens.push(token)
        }
      }
    } else {
      if (currentAccordionSectionTitle !== null) {
        currentAccordionContentTokens.push(token)
      } else {
        // console.log("Adding regular token:", token)
        currentRegularContentTokens.push(token)
      }
    }
  }

  if (currentAccordionSectionTitle !== null) {
    sections.push({
      type: "accordion",
      title: currentAccordionSectionTitle,
      content: renderTokensAsHtml(currentAccordionContentTokens),
      id: slugify(currentAccordionSectionTitle), // Use slugify here too
      level: currentAccordionLevel || accordionLevel,
    })
  }

  if (currentRegularContentTokens.length > 0) {
    sections.push({
      type: "regular",
      content: renderTokensAsHtml(currentRegularContentTokens),
    })
  }
  contentSections = sections

  const newOpenSections: Record<string, boolean> = {}
  contentSections.forEach((section) => {
    if (section.type === "accordion") {
      newOpenSections[section.id] = false
    }
  })
  openSections = newOpenSections
  return {
    contentSections,
    openSections,
  }
}
export const processMarkdown = (markdown: string) => {
  const tokens = marked.lexer(markdown)
  const res = processTokens(tokens)
  const tocItems = tokens
    .filter((token) => {
      // if (token.type === "heading") {
      //   console.log("heading token: ", token)
      // }
      return (
        token.type === "heading" && token.depth === offsetMarkdownHeadingLevels
      )
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((token: any) => ({
      text: token?.text,
      level: token?.depth,
      id: slugify(token?.text),
    }))
  return { ...res, tocItems }
}
