<script lang="ts">
  import { Chat, type Message } from "@ai-sdk/svelte"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import { chatIdGenerator } from "$lib/ai-related/chat"
  import {
    ArrowRightIcon,
    ChevronUpIcon,
    Maximize2Icon,
    Minimize2Icon,
    XIcon,
  } from "lucide-svelte"
  import { cn } from "$lib/utils"
  import Messages from "$lib/components/messages/messages.svelte"
  import { IsMobile } from "../hooks/is-mobile.svelte"
  import Button from "../components/ui/button/button.svelte"
  import { m } from "../paraglide/messages"

  interface NewDetailsChatProps {
    initialMessages?: Message[]
    logo?: string
    name?: string
    primaryColor?: string
  }

  let {
    initialMessages,
    logo = "/images/ai-chat-icon.svg",
    name = m.ask_funding_ai(),
    primaryColor = "#39988B",
  }: NewDetailsChatProps = $props()

  const getIsMobile = new IsMobile()
  let isOpen = $state(false)
  let isMaximized = $state(false)
  let isMobile = $derived(getIsMobile.current)

  const defaultOptions = [
    "Am I eligible for this program?",
    "What documents are needed to apply?",
    "Explain the conditions and requirements",
  ]

  const chat = new Chat({
    initialMessages,
    sendExtraMessageFields: true,
    api: "/api/chat",
    generateId: chatIdGenerator,
    onToolCall: ({ toolCall }) => {},
    maxSteps: 10,
  })

  const messages = $derived(
    chat.messages.filter((msg) => msg.role !== "system"),
  )

  function getOpen() {
    return isOpen
  }
  function toggleChat(open: boolean) {
    if (isMobile) {
      // scroll to top
      // const navbarHeight = document.getElementById("navbar-section")?.clientHeight
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    isOpen = open
  }
  function closeChat() {
    isOpen = false
    isMaximized = false
  }

  $effect(() => {
    isMobile = getIsMobile.current
  })
</script>

<Popover.Root bind:open={getOpen, toggleChat}>
  <Popover.Trigger
    id="program-detail-chat-btn"
    class={cn(
      "size-12 sm:size-16 rounded-full flex items-center justify-center shadow-md z-[1000] cursor-pointer",
      isOpen ? "bg-brand-primary/20" : "bg-white",
    )}
  >
    {#if !isOpen}
      <img
        src="/images/ai-chat-icon.svg"
        alt="Chat Icon"
        class="size-12 sm:size-16"
      />
    {:else}
      <span class="m-auto">
        <ChevronUpIcon class="size-8 text-brand-primary" />
      </span>
    {/if}
  </Popover.Trigger>

  {#if isOpen}
    {#if isMaximized}
      <!-- Overlay for maximized state (does not block clicks) -->
      <div
        class="w-screen h-screen fixed top-0 left-0 bg-black/30 pointer-events-none"
      ></div>
    {/if}

    <Popover.Content
      side="bottom"
      align="end"
      sideOffset={isMobile ? 0 : 10}
      alignOffset={10}
      class={cn(
        "rounded-none sm:rounded-2xl overflow-hidden w-screen sm:w-[437px] h-[calc(100dvh-82px)] sm:h-[60vh] p-0 border-none z-[99999]",
        isMaximized ? "!w-[1163px] sm:h-[70vh]" : "",
      )}
      interactOutsideBehavior="close"
      strategy="fixed"
      customAnchor={isMobile ? "#navbar-section" : "#program-detail-chat-btn"}
      preventScroll={isMobile}
    >
      <!-- Chat Window -->
      <div
        class={cn(
          `font-exo bg-white w-full h-full flex flex-col overflow-hidden`,
        )}
        style="--primary: {primaryColor}"
      >
        <!-- Header -->
        <div
          class="flex items-center gap-3 px-4 py-3 bg-brand-primary text-white sm:rounded-t-2xl"
        >
          {#if logo}
            <img src={logo} alt={name} class="w-8 h-8 rounded-md" />
          {/if}
          <span class="font-medium text-base flex-1">{name}</span>
          <div class="flex items-center gap-6">
            {#if !isMobile}
              <button
                class="text-white text-2xl transform rotate-90 cursor-pointer"
                onclick={() => (isMaximized = !isMaximized)}
              >
                {#if isMaximized}
                  <Minimize2Icon />
                {:else}
                  <Maximize2Icon />
                {/if}
              </button>
            {/if}
            <button
              class="text-white text-2xl cursor-pointer"
              onclick={closeChat}
            >
              <XIcon />
            </button>
          </div>
        </div>

        <!-- Messages -->
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
                {#each defaultOptions as option}
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

        <!-- Input -->
        <form
          onsubmit={chat.handleSubmit}
          class="border-t border-gray-200 p-4 relative bg-white"
        >
          <div class="flex gap-3 relative text-black">
            <input
              disabled={chat.status === "streaming" ||
                chat.status === "submitted"}
              bind:value={chat.input}
              placeholder={m.chat_search_input_placeholder()}
              class="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none text-black"
            />
            <Button
              size="icon"
              type="submit"
              disabled={chat.status === "streaming" ||
                chat.status === "submitted"}
              class="absolute right-1 top-1/2 cursor-pointer -translate-y-1/2 px-3 py-[10px] bg-[color:var(--primary)] text-white rounded-lg text-sm font-semibold"
            >
              <ArrowRightIcon class="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </Popover.Content>
  {/if}
</Popover.Root>
