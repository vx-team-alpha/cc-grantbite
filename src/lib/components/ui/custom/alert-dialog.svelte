<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js"

  import type { Snippet } from "svelte"

  type Props = {
    open: boolean
    imageSrc?: string
    title: string
    description: string
    children?: Snippet
    onClose?: () => void
  }

  let { open, imageSrc, title, description, children, onClose }: Props =
    $props()
</script>

<Dialog.Root bind:open onOpenChange={onClose}>
  <Dialog.Content
    class="flex flex-col items-center justify-center gap-6 sm:max-w-[493px] min-h-[323px] bg-white px-9"
  >
    {#if imageSrc}
      <img src={imageSrc} alt={title} class="size-16" />
    {/if}
    <div class="space-y-3 max-w-[387px]">
      <h3 class="text-base sm:text-lg font-semibold text-center">{title}</h3>
      <p
        class="text-sm sm:text-base leading-7 font-medium text-center max-w-md"
      >
        {description}
      </p>
    </div>
    {#if children}
      {@render children()}
    {/if}
  </Dialog.Content>
</Dialog.Root>
