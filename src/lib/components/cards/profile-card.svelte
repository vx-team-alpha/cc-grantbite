<script lang="ts">
  import TrashIcon from "$lib/svg/trash-icon.svelte"
  import { localizeHref } from "$src/lib/paraglide/runtime"
  import Button from "../ui/button/button.svelte"

  export let name: string
  export let fields: {
    label: string
    value: string
  }[]
  export let btnTxt: string

  export let link: string
</script>

<div
  class="border border-brand-primary bg-brand-primary/7 flex flex-col p-4 sm:p-7 rounded-3xl space-y-6"
>
  <h3 class="capitalize text-2xl sm:text-3xl font-bold text-brand-primary">
    {name}
  </h3>
  <div
    class="grid grid-rows-1 md:grid-rows-0 md:grid-cols-3 items-start gap-3 max-w-4xl"
  >
    {#each fields as field}
      <div
        class="grid grid-cols-2 md:grid-cols-1 gap-1 w-full md:max-w-[250px] text-body1"
      >
        <p class="font-normal">
          {field.label}
        </p>
        <p class=" font-semibold md:leading-10">
          {field.value}
        </p>
      </div>
    {/each}
  </div>

  <a
    href={localizeHref(link)}
    class="max-w-[271px] sm:w-full font-semibold text-lg sm:ms-auto flex"
  >
    <Button asChild class="sm:w-full h-10 sm:h-auto">
      {btnTxt}
    </Button>
  </a>
</div>
