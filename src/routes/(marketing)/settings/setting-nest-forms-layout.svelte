<script lang="ts">
  let { children, headline, subheadline } = $props()
</script>

<div
  class="app-container w-full h-screen flex flex-col items-center py-12 gap-2"
>
  <div
    class="flex flex-col gap-8 w-full items-center justify-center px-6 sm:px-12 py-7 sm:py-12 max-w-3xl mx-auto border border-brand-light-gray rounded-lg"
  >
    <div class="text-center space-y-2 max-w-[610px]">
      <h3 class="font-boldtext-xl sm:text-3xl">{headline}</h3>
      <p class="text-xs sm:text-base">
        {subheadline}
      </p>
    </div>
    {@render children?.()}
  </div>
</div>
