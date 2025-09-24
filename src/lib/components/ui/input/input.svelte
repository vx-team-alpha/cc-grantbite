<script lang="ts">
  import type {
    HTMLInputAttributes,
    HTMLInputTypeAttribute,
  } from "svelte/elements"
  import { cn, type WithElementRef } from "$lib/utils.js"

  type InputType = Exclude<HTMLInputTypeAttribute, "file">

  type Props = WithElementRef<
    Omit<HTMLInputAttributes, "type"> &
      (
        | { type: "file"; files?: FileList }
        | { type?: InputType; files?: undefined }
      )
  >

  let {
    ref = $bindable(null),
    value = $bindable(),
    type,
    files = $bindable(),
    class: className,
    ...restProps
  }: Props = $props()
</script>

{#if type === "file"}
  <input
    bind:this={ref}
    data-slot="input"
    class={cn(
      "selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input  placeholder:text-muted-foreground flex h-9 sm:h-12  w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm font-medium outline-none   disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",

      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      className,
    )}
    type="file"
    bind:files
    bind:value
    {...restProps}
  />
{:else}
  <input
    bind:this={ref}
    data-slot="input"
    class={cn(
      "border-input bg-background ring-offset-background placeholder:text-brand-light-gray focus-visible:ring-ring flex h-12 w-full rounded-xl border border-brand-light-gray px-7 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50",

      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      className,
    )}
    {type}
    bind:value
    {...restProps}
  />
{/if}
