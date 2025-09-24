<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js"
  import {
    ChevronsUpDownIcon,
    LoaderIcon,
    PlayIcon,
    XIcon,
  } from "lucide-svelte"
  import Button from "../components/ui/button/button.svelte"
  import type { FundingProgramWithTranslation } from "../db_translation_helper"
  import { cn } from "../utils"
  import ChatFundingResults from "./chat-funding-results.svelte"
  import ChatSidebar from "./chat-sidebar.svelte"
  import ChevronRight from "@lucide/svelte/icons/chevron-right"
  import { browser } from "$app/environment"
  // AI Chat imports
  import { Chat, type Message } from "@ai-sdk/svelte"
  import { searchChatIdGenerator } from "$lib/ai-related/chat"
  import { getLocale } from "$lib/paraglide/runtime.js"
  import { m } from "$lib/paraglide/messages"
  import { useBodyOverflow } from "../hooks/useBodyOverflow"
  import { IsMobile } from "../hooks/is-mobile.svelte"

  const getIsMobile = new IsMobile()

  let isMobile = $derived(getIsMobile.current)

  type SearchResultItem = Pick<
    FundingProgramWithTranslation,
    | "updated_at"
    | "title"
    | "introduction_short"
    | "overview_maximum_funding_amount"
    | "overview_financial_instrument"
    | "overview_deadline"
    | "overview_open_until"
    | "overview_region"
    | "overview_eligible_sectors_short"
    | "overview_beneficiary"
    | "provider_funding_body"
    | "provider_managed_by"
    | "permalink"
    | "program_status"
    | "featured_priority"
    | "id"
    | "bookmarked"
  >[]

  let showResults = $state(false)
  let isEnlarged = $state(false)
  let searchResults: SearchResultItem = $state([])
  let isSearching = $state(false)
  const initialMessages: Message[] = []

  const chat = new Chat({
    initialMessages,
    sendExtraMessageFields: true,
    api: "/api/chatSearch",
    headers: { "use-locale": getLocale() },
    generateId: searchChatIdGenerator,
    onToolCall: ({ toolCall }) => {
      if (toolCall.toolName === "display_programs_to_user") {
        const { permalinks } = toolCall.args as { permalinks: string[] }
        searchPrograms(permalinks)
          .then((res) => {
            searchResults = res
          })
          .catch((error) => {
            console.error("Search failed:", error)
          })
          .finally(() => {})
      }
    },

    onFinish: (message) => {
      isSearching = false
    },
    maxSteps: 10,
  })

  function handlePreviewClick() {
    showResults = !showResults
  }

  function handleEnlargeClick() {
    isEnlarged = !isEnlarged
  }

  async function searchPrograms(permalinks: string[]) {
    try {
      const res = await fetch("/api/programSearchResults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permalinks,
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }

      const { data, error } = await res.json()

      if (!error && data) {
        return data as SearchResultItem
      }
    } catch (e) {
      console.log(e)
      throw e
    }
    return []
  }

  function handleSuggestionClick(suggestion: string) {
    chat.input = suggestion
    isSearching = true
    chat.handleSubmit(new Event("submit"))
  }

  // Custom submit handler to set searching state immediately
  function handleSubmit(event: Event) {
    event.preventDefault()
    if (chat.input.trim()) {
      isSearching = true
      const rews = chat.handleSubmit(event)
    }
  }
</script>

<div class="teal-gradient flex items-center justify-center p-0 lg:py-6">
  <div
    use:useBodyOverflow={isEnlarged || isMobile}
    class={cn(
      "flex flex-col p-2 lg:rounded-xl bg-brand-primary",
      isEnlarged
        ? "fixed inset-0 w-screen h-screen z-[9999] !rounded-none"
        : "fixed top-[110px] sm:top-[150px] md:top-[150px] lg:top-0 lg:relative max-w-7xl w-full h-[calc(100dvh-120px)] sm:h-[calc(100dvh-140px)] lg:h-[calc(100dvh-250px)]",
    )}
  >
    <div class="bg-primary flex items-center justify-between p-4 gap-1.5">
      <div class="flex items-center gap-2">
        <Avatar.Root>
          <Avatar.Image src="/images/ai-chat-icon.svg" alt="" />
        </Avatar.Root>
        <p class="text-lg font-medium text-white">{m.ask_funding_ai()}</p>
      </div>

      <Button
        size="sm"
        variant="secondary"
        class="flex lg:hidden text-white md:group-hover:text-brand-dark-orange md:group-hover:fill-brand-dark-orange "
        onclick={handlePreviewClick}
      >
        {#if showResults}
          <PlayIcon class="size-3 fill-white rotate-180" /> back
        {:else}
          Preview <PlayIcon class="size-3 fill-white" />
        {/if}
      </Button>

      <!-- Enlarge Chat screen -->
      <Button
        size="sm"
        variant="ghost"
        class="hidden lg:flex text-white"
        onclick={handleEnlargeClick}
      >
        {#if isEnlarged}
          <XIcon class="size-5" />
        {:else}
          <ChevronsUpDownIcon
            class="size-5 text-white fill-transparent rotate-45"
          />
        {/if}
      </Button>
    </div>

    <div class={cn("flex flex-grow bg-white rounded-b-lg p-2 overflow-hidden")}>
      {#if !showResults}
        <div class="w-full items-center sm:overflow-y-auto lg:w-1/3 min-h-full">
          <ChatSidebar {chat} {handleSuggestionClick} {handleSubmit} />
        </div>
      {/if}
      <div
        class={cn(
          "border border-brand-primary/20 w-full p-4 rounded-md",
          "lg:flex",
          showResults ? "flex" : "hidden",
          isEnlarged ? "lg:w-full h-full" : "lg:w-3/4",
        )}
      >
        <ChatFundingResults Results={searchResults} />
      </div>
    </div>
  </div>
</div>
