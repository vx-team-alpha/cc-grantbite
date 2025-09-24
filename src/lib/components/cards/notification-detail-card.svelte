<script lang="ts">
  import Button from "../ui/button/button.svelte"
  import { PencilIcon } from "$lib/svg"
  import TrashIcon from "$lib/svg/trash-icon.svelte"
  import type { SubmitFunction } from "@sveltejs/kit"
  import { applyAction, enhance } from "$app/forms"
  import { goto, invalidate } from "$app/navigation"
  import { toast } from "svelte-sonner"
  import { localizeHref } from "$src/lib/paraglide/runtime"
  import { m } from "$src/lib/paraglide/messages"
  import { PenIcon } from "lucide-svelte"

  const { project, className = "" } = $props()

  const basicInfo = [
    { label: m.project_name(), value: project.name },
    { label: m.project_stage(), value: project.stage },
    { label: m.use_of_funds(), value: project.useOfFunds },
  ]

  const financialInfo = [
    { label: m.project_term(), value: project.term },
    { label: m.budget(), value: project.budget },
  ]

  let loading = $state(false)

  const handleSubmit: SubmitFunction = () => {
    loading = true
    return async ({ update, result }) => {
      await update({ reset: false })
      await applyAction(result)
      loading = false
      await invalidate("/en/notifications")

      if (result.type === "success" && result.data?.success) {
        toast.success(m.notification_deleted_success())
        goto(localizeHref("/notifications"))
      } else {
        toast.error(m.notification_delete_failed())
      }
    }
  }
</script>

<div
  class="grid md:grid-cols-[2fr_2fr_1fr] border border-brand-primary rounded-xl mt-8 p-5 gap-4 md:gap-8 mx-auto bg-[#F3FFFD] {className}"
>
  <div class="flex flex-col gap-4 md:gap-y-8 grow">
    {#each basicInfo as item}
      <div class="flex gap-4 text-body2">
        <p
          class="font-semibold whitespace-nowrap max-sm:max-w-20 max-sm:w-full"
        >
          {item.label}:
        </p>
        <p class="capitalize">{item.value}</p>
      </div>
    {/each}
  </div>

  <div class="flex flex-col gap-4 md:gap-y-6">
    {#each financialInfo as item}
      <div class="flex gap-4 text-body2">
        <p
          class="font-semibold whitespace-nowrap max-sm:max-w-20 max-w-24 w-full"
        >
          {item.label}:
        </p>
        <p class="capitalize">{item.value}</p>
      </div>
    {/each}
  </div>

  <div
    class="flex flex-wrap md:flex-col items-center justify-end md:justify-start gap-5"
  >
    <a href={`/notifications/create?id=${project.id}`}>
      <Button
        variant="ghost"
        class="flex items-center justify-center !px-4 rounded-none w-fit text-brand-blue border-b-2 border-transparent hover:border-brand-blue gap-2"
        asChild
      >
        <PenIcon fill="#3965f5" className="fill-brand-blue stroke-3" />
        {m.edit()}
      </Button>
    </a>
    <form
      method="POST"
      use:enhance={handleSubmit}
      action="/account/api?/deleteNotification"
    >
      <input type="hidden" name="id" value={project.id} />
      <Button
        variant="ghost"
        type="submit"
        name="id"
        aria-label="Id"
        disabled={loading}
        class="flex items-center justify-center rounded-none !px-4 w-fit text-red-500 border-b-2 border-transparent hover:border-red-500 gap-2"
      >
        <TrashIcon className="" />
        {m.delete()}
        {#if loading}
          <span class="sr-only">{m.loading()}</span>
        {/if}
      </Button>
    </form>
  </div>
</div>
