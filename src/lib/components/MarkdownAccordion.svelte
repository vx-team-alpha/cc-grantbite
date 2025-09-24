<script lang="ts">
  import { onMount } from "svelte"
  import { marked, type Token, type Tokens } from "marked"
  import { slide, fade } from "svelte/transition"
  import { cubicOut } from "svelte/easing"
  import DOMPurify from "dompurify"
  import ArrowDownIcon from "$lib/svg/arrow-down-icon.svelte"
  import { cn } from "$lib/utils"

  // Define types for the sections
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

  interface Props {
    markdown?: string
    accordionLevel?: number
    offsetMarkdownHeadingLevels?: number
  }

  let {
    markdown = "",
    accordionLevel = 2,
    offsetMarkdownHeadingLevels = 0,
  }: Props = $props()

  let contentSections = $state<ContentSection[]>([])
  let openSections = $state<Record<string, boolean>>({})

  /**
   * Slugify function to create consistent IDs (same as table of contents)
   * @param text The heading text to convert to a slug
   * @returns A URL-friendly slug
   */
  function slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  onMount(async () => {
    const tokens = marked.lexer(markdown)
    processTokens(tokens)
    // console.log("Processed content sections:", contentSections)
  })

  /**
   * Sanitizes HTML content using DOMPurify
   * @param html Raw HTML string
   * @returns Sanitized HTML string
   */
  function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
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
      ALLOWED_ATTR: ["href", "src", "alt", "title", "class"],
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
  }

  function toggleSection(id: string) {
    openSections[id] = !openSections[id]
  }
  let proseClass = "prose prose-h2:text-brand-primary "
</script>

<div class="-mx-auto -max-w-3xl font-sans leading-relaxed">
  {#each contentSections as section, index (section.type === "accordion" ? section.id : `${section.type}-${index}`)}
    {#if section.type === "accordion"}
      <!-- Accordion sections -->
      <div
        class="mb-4 overflow-hidden rounded"
        in:fade={{ duration: 200 }}
        id={section.id}
      >
        <button
          type="button"
          class="focus:ring-opacity-50 flex w-full cursor-pointer items-center justify-between bg-slate-50 p-3 text-left rounded-xl transition-colors duration-200focus:outline-none border border-slate-200"
          onclick={() => toggleSection(section.id)}
          aria-expanded={openSections[section.id]}
          aria-controls={`content-${section.id}`}
        >
          <!-- Dynamically render heading tag -->
          <svelte:element
            this={"h" + section.level}
            id={`header-${section.id}`}
            class="m-0 text-xl font-semibold text-slate-800"
            >{section.title}</svelte:element
          >
          <span
            class="ml-4 text-2xl font-bold text-slate-600 transition-transform duration-300 ease-in-out {openSections[
              section.id
            ]
              ? 'rotate-180'
              : ''}"
          >
            <!-- Use ArrowDownIcon for the toggle icon -->
            {#if openSections[section.id]}
              <ArrowDownIcon className="transform " />
            {:else}
              <ArrowDownIcon />
            {/if}
          </span>
        </button>

        {#if openSections[section.id]}
          <div
            class={cn("p-4 max-w-none", proseClass)}
            id={`content-${section.id}`}
            role="region"
            aria-labelledby={`header-${section.id}`}
            transition:slide={{ duration: 300, easing: cubicOut }}
          >
            <!-- Content is sanitized with DOMPurify before rendering -->
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html section.content}
          </div>
        {/if}
      </div>
    {:else}
      <!-- Regular content -->
      <div
        class={cn("mb-4 max-w-none", proseClass)}
        in:fade={{ duration: 200 }}
        id={section.tokenType === "heading" ? section.id : section.type}
      >
        <!-- Content is sanitized with DOMPurify before rendering -->
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html section.content}
      </div>
    {/if}
  {/each}
</div>
