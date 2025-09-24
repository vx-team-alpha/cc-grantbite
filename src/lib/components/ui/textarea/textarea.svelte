<script lang="ts">
  import { cn, type WithElementRef, type WithoutChildren } from "$lib/utils.js"
  import type { HTMLTextareaAttributes } from "svelte/elements"

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props()
</script>

<textarea
  bind:this={ref}
  data-slot="textarea"
  class={cn(
    " rounded-xl border   text-base px-7 py-5 border-muted-foreground  placeholder:text-muted-foreground     aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 field-sizing-content min-h-30  flex   w-full bg-transparent  outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 ",
    className,
  )}
  bind:value
  {...restProps}
></textarea>
