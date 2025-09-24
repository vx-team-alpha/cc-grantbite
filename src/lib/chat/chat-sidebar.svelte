<script lang="ts">
  import Button from "../components/ui/button/button.svelte"
  import { cn } from "../utils"
  import type { Chat } from "@ai-sdk/svelte"
  import { marked } from "marked"
  import DOMPurify from "dompurify"
  import { browser } from "$app/environment"
  import { m } from "../paraglide/messages"
  import { ArrowRightIcon, LoaderIcon } from "lucide-svelte"
  import ThinkingMessage from "../components/messages/thinking-message.svelte"
  import Messages from "../components/messages/messages.svelte"
  import Textarea from "../components/ui/textarea/textarea.svelte"
  import { IsMobile } from "../hooks/is-mobile.svelte"

  let {
    chat,
    handleSuggestionClick,
    handleSubmit,
  }: {
    chat: Chat
    handleSuggestionClick?: (suggestion: string) => void
    handleSubmit?: (event: Event) => void
  } = $props()

  // Derived messages - filter out system messages
  const messages = $derived(
    chat.messages.filter((msg) => msg.role !== "system"),
  )

  // Static suggestions for when there are no messages
  const Suggestions = [
    m.chat_suggestion_1(),
    m.chat_suggestion_2(),
    m.chat_suggestion_3(),
    m.chat_suggestion_4(),
  ]
  const getIsMobile = new IsMobile()

  let isMobile = $derived(getIsMobile.current)

  // Auto-scroll to bottom when new messages arrive or when loading state changes
  $effect(() => {
    if (isMobile) {
      // scroll to top
      // const navbarHeight = document.getElementById("navbar-section")?.clientHeight
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  })

  // Default suggestion click handler if none provided
  function defaultHandleSuggestionClick(suggestion: string) {
    chat.input = suggestion
    chat.handleSubmit(new Event("submit"))
  }

  // Default submit handler if none provided
  function defaultHandleSubmit(event: Event) {
    chat.handleSubmit(event)
  }
  const isSearching = $derived(
    chat.status === "streaming" || chat.status === "submitted",
  )
  // Use provided handlers or defaults
  const onSuggestionClick =
    handleSuggestionClick || defaultHandleSuggestionClick
  const onSubmit = handleSubmit || defaultHandleSubmit
</script>

<div class="flex flex-col h-full overflow-y-auto">
  <Messages
    {messages}
    loading={chat.status === "streaming" || chat.status === "submitted"}
  >
    {#if messages.length < 1}
      <div class="text-lg">
        <p>
          👋{m.chat_btn_greeting_txt()}
        </p>
        <div class="flex flex-col gap-4 mt-8">
          {#each Suggestions as option}
            <button
              class="p-5 bg-brand-light-blue/50 border border-brand-primary/20 cursor-pointer text-brand-primary rounded-md flex justify-between hover:bg-brand-light-blue hover:border-brand-primary/50"
              onclick={() => {
                chat.input = option
                chat.handleSubmit()
              }}
            >
              <span class="text-left text-sm font-medium">{option}</span>
              <ArrowRightIcon class="w-4 h-4" />
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </Messages>

  <!-- Input field -->
  <div class="sticky w-full">
    <form onsubmit={onSubmit}>
      <div
        class="flex items-center relative bg-white rounded-md sm:rounded-xl h-12 z-[10000]"
      >
        <Textarea
          bind:value={chat.input}
          placeholder={m.chat_input_placeholder()}
          class="w-full resize-none h-12 min-h-0 ps-4 pe-12 py-3 text-base font-medium font-exo rounded-lg overflow-hidden border border-brand-primary/15 placeholder-brand-primary-dark"
          disabled={isSearching}
          onkeydown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.isComposing
            ) {
              event.preventDefault()
              if (!isSearching) {
                onSubmit(event)
              }
            }
          }}
        />

        <!-- Search Button -->
        <Button
          type="submit"
          size="icon"
          class="group absolute right-[9px] top-1/2 transform -translate-y-1/2 size-9 rounded-md flex items-center justify-center "
          disabled={isSearching}
        >
          {#if isSearching}
            <LoaderIcon class="w-5 h-5 animate-spin text-white" />
          {:else}
            <ArrowRightIcon class="w-5 h-5 text-white" />
          {/if}
        </Button>
      </div>
    </form>
  </div>
</div>
