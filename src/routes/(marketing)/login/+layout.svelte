<script lang="ts">
  interface Props {
    children?: import("svelte").Snippet
  }

  let { children }: Props = $props()
  let isEurope = $state(false)
  try {
    isEurope = Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone.startsWith("Europe/")
  } catch (e) {
    /* continue */
  }
</script>

<div class="flex text-center justify-center content-center py-12 px-2">
  {@render children?.()}
  <!-- <div class="mt-8 {isEurope ? 'block' : 'hidden'}">
    🍪 Logging in uses Cookies 🍪
  </div> -->
</div>
