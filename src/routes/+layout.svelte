<script lang="ts">
  import "../app.css"
  import "@fontsource-variable/oswald"
  import "@fontsource-variable/exo"

  import { navigating } from "$app/stores"
  import { expoOut } from "svelte/easing"
  import { slide } from "svelte/transition"
  import Cookies from "$lib/components/Cookies.svelte"

  import { Toaster } from "$lib/components/ui/sonner/index.js"
  import SizeIndicator from "$src/lib/components/dev-tools/size-indicator.svelte"

  interface Props {
    children?: import("svelte").Snippet
  }

  let { children }: Props = $props()
</script>

{#if $navigating}
  <!-- 
    Loading animation for next page since svelte doesn't show any indicator. 
     - delay 100ms because most page loads are instant, and we don't want to flash 
     - long 12s duration because we don't actually know how long it will take
     - exponential easing so fast loads (>100ms and <1s) still see enough progress,
       while slow networks see it moving for a full 12 seconds
  -->
  <div
    class="fixed w-full top-0 right-0 left-0 h-1 z-50 bg-primary"
    in:slide={{ delay: 100, duration: 12000, axis: "x", easing: expoOut }}
  ></div>
{/if}

<Toaster
  position="top-center"
  toastOptions={{
    classes: {
      toast: "!bg-white",
    },
  }}
/>
{@render children?.()}

<Cookies />
<SizeIndicator />
