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
    markdownContent: {
      contentSections: ContentSection[]
      openSections: Record<string, boolean>
    }
  }

  let { markdownContent }: Props = $props()

  // let contentSections = $state<ContentSection[]>([])
  let openSections = $state<Record<string, boolean>>(
    markdownContent.openSections,
  )

  onMount(async () => {
    // const tokens = marked.lexer(markdown)
    // processTokens(tokens)
    // console.log("Processed content sections:", contentSections)
  })

  function toggleSection(id: string) {
    openSections[id] = !openSections[id]
  }
  let proseClass = "prose prose-h2:text-brand-primary "
</script>

<div class="-mx-auto -max-w-3xl font-sans leading-relaxed">
  {#each markdownContent.contentSections as section, index (section.type === "accordion" ? section.id : `${section.type}-${index}`)}
    {#if section.type === "accordion"}
      <!-- Accordion sections -->
      <div
        class="mb-4 overflow-hidden rounded"
        in:fade={{ duration: 200 }}
        id={section.id}
      >
        <button
          type="button"
          class="focus:ring-opacity-50 flex w-full cursor-pointer items-center justify-between bg-slate-50 p-3 text-left rounded-xl transition-colors duration-200 focus:outline-none border border-slate-200 hover:border-brand-primary/30"
          onclick={() => toggleSection(section.id)}
          aria-expanded={openSections[section.id]}
          aria-controls={`content-${section.id}`}
        >
          <!-- Dynamically render heading tag -->
          <svelte:element
            this={"h" + section.level}
            id={`header-${section.id}`}
            class="m-0 text-xl font-semibold text-slate-800"
          >
            <!-- <span>{index + 1}</span> -->
            {section.title}</svelte:element
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
        class={cn(
          "mb-2 max-w-none",
          proseClass,
          section.tokenType === "heading" ? "mt-12 mb-4" : "mb-4",
        )}
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
