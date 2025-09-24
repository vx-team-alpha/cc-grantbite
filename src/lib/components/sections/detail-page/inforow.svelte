<script lang="ts">
  type Props = {
    icon?: string
    label: string
    hasValue?: boolean
    wrapperClass?: string
    children?: any
  }
  const { icon, label, hasValue, children, wrapperClass }: Props = $props()
</script>

{#if hasValue}
  <div
    class="{wrapperClass} grid text-wrap xs:grid-cols-2 sm:grid-cols-[186px_1fr] gap-2 min-h-[34px] text-body2 items-start"
  >
    <div class="flex items-center gap-x-2 text-left">
      {#if icon}
        <img src={icon} alt={label} />
      {/if}
      <p class="font-semibold text-gray-800 whitespace-nowrap">
        {label}:
      </p>
    </div>
    <p class="font-normal text-gray-900">
      {@render children?.()}
    </p>
  </div>
{/if}
