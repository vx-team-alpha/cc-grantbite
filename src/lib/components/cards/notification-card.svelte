<script lang="ts">
  import Button from "../ui/button/button.svelte"
  import { PencilIcon } from "$lib/svg"
  import TrashIcon from "$lib/svg/trash-icon.svelte"
  import type { SubmitFunction } from "@sveltejs/kit"
  import { applyAction, enhance } from "$app/forms"
  import { invalidate } from "$app/navigation"
  import AlertDialog from "../ui/custom/alert-dialog.svelte"
  import { localizeHref } from "$src/lib/paraglide/runtime"
  import { toast } from "svelte-sonner"
  import { m } from "$src/lib/paraglide/messages"

  const { project, className = "" } = $props()
  let isSuccessDialogOpen = $state(false)
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
      toast.success(m.toast_notification_delete())
      await invalidate(localizeHref("/notifications"))
    }
  }
</script>

<div
  class="grid md:grid-cols-[2fr_2fr_2fr_1fr] border-gray-200 mt-8 py-7 mx-auto gap-4 {className}"
>
  <div class="flex flex-col gap-4 md:gap-y-8 grow">
    {#each basicInfo as item}
      <div class="flex gap-4 text-body2">
        <p
          class="font-semibold whitespace-nowrap max-sm:max-w-20 max-sm:w-full"
        >
          {item.label}:
        </p>
        <p class="capitalize">
          {item.value}
        </p>
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
    class="flex flex-row md:flex-col space-y-7 md:items-center md:justify-between text-body2"
  >
    {#if project.fundingProgramsFound}
      <p class="text-base">{m.program_found_label()}:</p>

      <p class="text-base md:text-4xl capitalize font-bold">
        {project.fundingProgramsFound}
      </p>
    {:else}
      <p class="text-base">{m.no_notifications_programs()}</p>
    {/if}

    <a href={`/notifications/${project.id}`}>
      <Button
        size="lg"
        asChild
        class="max-w-[300px] w-full hidden md:inline-flex "
      >
        {m.search_result_card_show_details()}
      </Button>
    </a>
  </div>

  <div
    class="flex flex-wrap md:flex-col items-center justify-end md:justify-start gap-2 sm:gap-5"
  >
    <a href={`/notifications/create?id=${project.id}`}>
      <Button
        variant="ghost"
        class="flex items-center justify-center  !px-3 w-fit text-brand-blue border-b-2 border-transparent hover:border-brand-blue gap-2 rounded-none"
        asChild
      >
        <PencilIcon className="size-5 fill-brand-blue" />
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
        class="flex items-center justify-center  !px-3 w-fit text-red-500 border-b-2 border-transparent hover:border-red-500 gap-2 rounded-none"
      >
        <TrashIcon className="size-5" />
        {m.delete()}
        {#if loading}
          <span class="sr-only">{m.loading()}.</span>
        {/if}
      </Button>
    </form>
    <a href={`/notifications/${project.id}`}>
      <Button class="md:hidden inline-flex" asChild
        >{m.search_result_card_show_details()}</Button
      >
    </a>
  </div>
</div>

<AlertDialog
  title="Notificatoin deleted"
  imageSrc="/images/yellow-profile.svg"
  description="Notification Deleted successfully."
  open={isSuccessDialogOpen}
  onClose={() => (isSuccessDialogOpen = false)}
/>
