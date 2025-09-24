<script lang="ts">
  import { m } from "$src/lib/paraglide/messages"
  import { LoaderIcon } from "lucide-svelte"
  import { fly } from "svelte/transition"
</script>

<div
  class="group/message mx-auto w-full max-w-3xl self-end"
  data-role="assistant"
  in:fly={{ opacity: 0, y: 5 }}
>
  <div
    class="
      group-data-[role=user]/message:bg-muted flex w-full gap-2 rounded-xl group-data-[role=user]/message:mr-auto
      group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:px-3
      group-data-[role=user]/message:py-2
    "
  >
    <div
      class="ring-brand-primary flex size-8 shrink-0 items-center justify-center rounded-full ring-1"
    >
      <LoaderIcon size={14} class="animate-spin text-brand-primary" />
    </div>
    <div class="flex w-full flex-col">
      <div class="text-brand-primary flex flex-col">
        {m.thinking()}
      </div>
    </div>
  </div>
</div>
