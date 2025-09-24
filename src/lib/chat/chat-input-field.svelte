<script lang="ts">
  import { onMount } from "svelte"

  import { toast } from "svelte-sonner"

  import { replaceState } from "$app/navigation"
  import type { Chat } from "@ai-sdk/svelte"
  import { Textarea } from "../components/ui/textarea"
  import Button from "../components/ui/button/button.svelte"
  import { ArrowUpIcon, Loader2, StopCircleIcon } from "lucide-svelte"
  import { cn } from "../utils"
  import { m } from "../paraglide/messages"

  let {
    chatClient,
    class: c,
  }: {
    chatClient: Chat
    class?: string
  } = $props()

  let textareaRef = $state<HTMLTextAreaElement | null>(null)
  const loading = $derived(
    chatClient.status === "streaming" || chatClient.status === "submitted",
  )

  const adjustHeight = () => {
    if (textareaRef) {
      textareaRef.style.height = "auto"
      textareaRef.style.height = `${textareaRef.scrollHeight + 2}px`
    }
  }

  const resetHeight = () => {
    if (textareaRef) {
      textareaRef.style.height = "auto"
      textareaRef.style.height = "98px"
    }
  }

  function setInput(value: string) {
    chatClient.input = value
    adjustHeight()
  }

  async function submitForm(event?: Event) {
    await chatClient.handleSubmit(event)
    resetHeight()
  }

  onMount(() => {
    adjustHeight()
  })
</script>

<div class="relative flex w-full flex-col gap-4">
  <Textarea
    bind:ref={textareaRef}
    placeholder="Send a message..."
    bind:value={() => chatClient.input, setInput}
    class={cn(
      "bg-muted max-h-[calc(75dvh)] min-h-[24px] resize-none overflow-hidden rounded-2xl pb-10 !text-base dark:border-zinc-700",
      c,
    )}
    rows={2}
    autofocus
    onkeydown={(event) => {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault()

        if (loading) {
          toast.error(m.toast_ai_wait_error())
        } else {
          submitForm()
        }
      }
    }}
  />

  <div class="absolute right-0 bottom-0 flex w-fit flex-row justify-end p-2">
    <Button
      class="h-fit rounded-full border p-1.5 dark:border-zinc-600"
      onclick={(event) => {
        event.preventDefault()
        submitForm()
      }}
      disabled={chatClient.input.length === 0}
    >
      {#if loading}
        <ArrowUpIcon size={14} />
      {:else}
        <Loader2 />
      {/if}
    </Button>
  </div>
</div>
