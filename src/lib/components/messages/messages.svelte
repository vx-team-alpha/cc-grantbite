<script lang="ts">
  import { onMount } from "svelte"
  import type { UIMessage } from "@ai-sdk/svelte"
  import { getLock } from "$lib/hooks/lock"
  import { Markdown } from "../markdown"
  import ThinkingMessage from "./thinking-message.svelte"
  import { m } from "$src/lib/paraglide/messages"

  let containerRef = $state<HTMLDivElement | null>(null)
  let endRef = $state<HTMLDivElement | null>(null)

  let {
    loading,
    messages,
    children,
  }: {
    loading: boolean
    messages: UIMessage[]
    children: () => any
  } = $props()

  let mounted = $state(false)
  onMount(() => {
    mounted = true
  })

  const scrollLock = getLock("messages-scroll")

  $effect(() => {
    if (!(containerRef && endRef)) return

    const observer = new MutationObserver(() => {
      if (!endRef || scrollLock.locked) return
      endRef.scrollIntoView({ behavior: "instant", block: "end" })
    })

    observer.observe(containerRef, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    })

    return () => observer.disconnect()
  })
</script>

<div
  bind:this={containerRef}
  class="flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-4 p-2 px-4"
>
  {@render children?.()}
  {#each messages as message (message.id)}
    <div
      class={` w-full px-4 py-3 rounded-xl text-sm leading-relaxed ${
        message.role === "user"
          ? "bg-white  self-start text-black font-medium max-w-[80%]"
          : "max-w-[90%] bg-brand-light-blue border-r-4 border-[color:var(--color-primary)] self-end text-[color:var(--color-primary)] relative"
      }`}
    >
      {#if message.role === "assistant"}
        <p class="text-xs font-semibold text-[color:var(--color-primary)] mb-1">
          {m.ai_name()}:
        </p>
      {/if}

      <Markdown
        md={`${message.role === "user" ? `${m.you_asked()}:` : ""} ${message.content}`}
      />
    </div>
  {/each}

  {#if loading && messages.length > 0 && messages[messages.length - 1].role === "user"}
    <ThinkingMessage />
  {/if}

  <div bind:this={endRef} class="min-h-[24px] min-w-[24px] shrink-0"></div>
</div>
