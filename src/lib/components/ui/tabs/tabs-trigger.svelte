<script lang="ts">
  import { Tabs as TabsPrimitive } from "bits-ui"
  import { cn } from "$lib/utils.js"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: TabsPrimitive.TriggerProps = $props()
</script>

<TabsPrimitive.Trigger
  data-slot="tabs-trigger"
  class={cn(
    "ring-offset-background focus-visible:ring-ring data-[state=active]:text-brand-primary inline-flex items-center justify-center capitalize cursor-pointer whitespace-nowrap  px-3 py-4 md:px-9 md:py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-2 data-[state=active]:border-b-brand-primary",
    className,
  )}
  {...restProps}
/>
