<script>
  import { onMount } from "svelte"
  import { browser } from "$app/environment"

  const isProduction = process.env.NODE_ENV === "production"
  let width = 0
  let height = 0

  function updateDimensions() {
    if (browser) {
      width = window.innerWidth
      height = window.innerHeight
    }
  }

  onMount(() => {
    updateDimensions()

    if (browser) {
      window.addEventListener("resize", updateDimensions)

      return () => {
        window.removeEventListener("resize", updateDimensions)
      }
    }
  })
</script>

{#if !isProduction}
  <div
    class="fixed bottom-5 left-5 flex items-center gap-2 rounded-full bg-black px-2.5 py-1 font-mono text-xs font-medium text-white"
  >
    <span>
      {width.toLocaleString()} x {height.toLocaleString()}
    </span>
    <div class="h-4 w-px bg-gray-800"></div>
    <span class="sm:hidden">XS</span>
    <span class="hidden sm:inline md:hidden">SM</span>
    <span class="hidden md:inline lg:hidden">MD</span>
    <span class="hidden lg:inline xl:hidden">LG</span>
    <span class="hidden xl:inline 2xl:hidden">XL</span>
    <span class="hidden 2xl:inline">2XL</span>
  </div>
{/if}
