<script lang="ts">
  let { headline, children, headerClass = "", contentClass = "" } = $props()
</script>

<div class="rounded-[10px] overflow-hidden">
  <div class="{headerClass} px-6 py-2">
    <h2 class="font-semibold text-white text-body1">
      {headline}
    </h2>
  </div>
  <div class="{contentClass} p-6 space-y-5 rounded-b-[10px]">
    {@render children?.()}
  </div>
</div>
