<script lang="ts">
  import { applyAction, enhance } from "$app/forms"
  import type { SubmitFunction } from "@sveltejs/kit"
  import { Bookmark } from "lucide-svelte"
  import AlertDialog from "./ui/custom/alert-dialog.svelte"
  import Button from "./ui/button/button.svelte"
  import { cn } from "../utils"
  import FormButton from "./ui/form/form-button.svelte"
  import { localizeHref } from "../paraglide/runtime"
  import { toast } from "svelte-sonner"
  import { m } from "../paraglide/messages"

  interface Props {
    id: string
    actionPath: string
    size?: "sm" | "lg" | "outline"
    isChecked?: boolean
    class?: string
  }

  const item: Props = $props()
  const { actionPath, id, isChecked, size = "sm", class: className } = item
  let checked = $state(isChecked || false)
  let loading = $state(false)
  let isSuccessDialogOpen = $state(false)
  let isErrorDialogOpen = $state(false)
  let errorMessage = $state("")

  const handleSubmit: SubmitFunction = () => {
    loading = true
    return async ({ update, result }) => {
      await update({ reset: false })
      await applyAction(result)
      loading = false

      if (result.type === "success") {
        checked = !checked
        toast.success(
          checked ? m.toast_bookmard_success() : m.toast_bookmark_remove(),
        )
        isSuccessDialogOpen = true
      } else if (result.type === "failure") {
        const error = result.data?.error || m.error_generic()
        errorMessage = error
        isErrorDialogOpen = true
      } else if (result.type === "error") {
        errorMessage = result.error?.message || m.error_unexpected()
        isErrorDialogOpen = true
        toast.error(m.toast_try_again())
      }
    }
  }
</script>

<form
  class={cn("inline-block", className)}
  method="POST"
  use:enhance={handleSubmit}
  action={actionPath}
>
  <input type="hidden" name="fundingId" value={id} />

  <FormButton
    type="submit"
    name="bookmark"
    aria-label={m.aria_label_bookmark()}
    variant={size == "lg"
      ? checked
        ? "outline_secondary"
        : "outline"
      : size == "outline"
        ? "outline"
        : "ghost"}
    disabled={loading}
    class={cn("cursor-pointer rounded-xl !p-1 -mt-1.5 group")}
  >
    {#if checked}
      <Bookmark
        class="text-brand-primary fill-brand-primary md:group-hover:fill-brand-dark-orange md:group-hover:text-brand-dark-orange size-8"
        strokeWidth={1.5}
      />
      {#if size === "lg"}
        <span class="hidden xl:flex">{m.span_funding_saved()}</span>
      {/if}
    {:else}
      <Bookmark
        class="text-brand-primary md:group-hover:text-brand-dark-orange md:group-hover:fill-brand-dark-orange size-8"
        strokeWidth={1.5}
      />
      {#if size == "lg"}
        <span class="hidden xl:flex">{m.span_save_funding()}</span>
      {/if}
    {/if}
    {#if loading}
      <span class="sr-only">{m.span_loading()}</span>
    {/if}
  </FormButton>
</form>

<!-- Success / Remove Alert -->
<!--
<AlertDialog
  title={checked ? m.alert_title_success() : m.alert_title_removed()}
  imageSrc="/images/yellow-save.svg"
  description={checked
    ? m.alert_description_success()
    : m.alert_description_removed()}
  open={isSuccessDialogOpen}
  onClose={() => (isSuccessDialogOpen = false)}
/>
-->

<!-- Error Alert -->
<AlertDialog
  title={m.alert_title_error()}
  imageSrc="/images/yellow-save.svg"
  description={m.alert_description_error()}
  open={isErrorDialogOpen}
  onClose={() => (isErrorDialogOpen = false)}
>
  <a
    href={localizeHref("login/sign_in")}
    class="max-w-[250px] w-full flex items-center justify-center gap-2"
  >
    <Button size="lg" asChild class="w-full">{m.navbar_login()}</Button>
  </a>
  <a
    href={localizeHref("login/sign_up")}
    class="max-w-[250px] w-full flex items-center justify-center gap-2"
  >
    <Button variant="outline" size="lg" class="max-w-[250px] w-full" asChild>
      {m.navbar_register()}
    </Button>
  </a>
</AlertDialog>
