<script lang="ts">
  import TrashIcon from "$lib/svg/trash-icon.svelte"
  import { cn } from "$src/lib/utils"
  import Button from "../ui/button/button.svelte"

  export interface PageData {
    name: string
    type: "name" | "email" | "password" | "delete"
    fields: {
      label: string
      value: string
    }[]
    btnTxt: string
    info: string
    link: string
    provider?: string
  }

  const { data } = $props<{ data: PageData }>()

  const { name, type, link, btnTxt, fields, info, provider } = data
</script>

<div
  class="border border-brand-primary bg-brand-primary/10 flex flex-col p-4 sm:p-7 rounded-3xl space-y-6"
>
  <h3 class=" text-2xl font-bold text-brand-primary">{name}</h3>
  <div class="flex justify-between flex-wrap gap-4">
    <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:gap-12">
      {#if type === "name" || type === "email"}
        {#each fields as field}
          <div class="flex gap-4">
            <p class="text-xs sm:text-base font-normal">
              {field.label}:
            </p>
            <p class="text-xs sm:text-base font-medium">
              {field.value}
            </p>
          </div>
        {/each}
      {:else}
        <div class="flex gap-4">
          <p class="text-xs sm:text-base font-normal">{info}</p>
        </div>
      {/if}
    </div>
    {#if type == "delete"}
      <!-- <a class="group max-w-[271px] w-full  font-semibold text-lg"> -->
      <Button
        href={link}
        variant="destructive"
        class="max-w-[271px] w-full flex items-center  justify-center gap-2.5 font-semibold text-lg  border-2 border-destructive text-destructive bg-transparent hover:text-white"
        asChild
      >
        <TrashIcon className="size-6" />
        {btnTxt}
      </Button>
      <!-- </a> -->
    {:else}
      <a
        href={type === "password" && provider !== "email" ? undefined : link}
        class={cn("max-w-[271px] w-full font-semibold text-lg")}
        aria-disabled={type === "password" && provider !== "email"
          ? "false"
          : "true"}
      >
        <Button
          disabled={type == "password" && provider !== "email"}
          class={cn(
            "w-full",
            type === "password" && provider !== "email"
              ? "bg-gray-600 pointer-events-none"
              : "",
          )}
          asChild
        >
          <span>{btnTxt}</span>
        </Button>
      </a>
    {/if}
  </div>
</div>
