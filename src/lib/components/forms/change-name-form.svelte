<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { ChangeNameFormSchema, type ChangeNameSchemaType } from "$lib/schemas"
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import AlertDialog from "../ui/custom/alert-dialog.svelte"
  import { goto, invalidate } from "$app/navigation"
  import { toast } from "svelte-sonner"
  import { localizeHref } from "$src/lib/paraglide/runtime"
  import { m } from "$lib/paraglide/messages" // ✅ for translations

  const { data } = $props<{
    data: SuperValidated<Infer<ChangeNameSchemaType>>
  }>()

  let isSuccessDialogOpen = $state(false)

  const form = superForm(
    {
      firstName: data?.data?.firstName || "",
      lastName: data?.data?.lastName || "",
    },
    {
      validators: zodClient(ChangeNameFormSchema),
      resetForm: false,
      onUpdated: async ({ form }) => {
        if (form.valid && !form.message) {
          await invalidate("/en/settings")
          toast.success(m.settings_name_updated()) // ✅ translated toast
          goto(localizeHref("/en/settings"))
        }
      },
    },
  )
  const { form: formData, enhance, message, submitting } = form
</script>

<form
  method="POST"
  use:enhance
  class="w-full space-y-7 text-start max-w-[610px]"
>
  <!-- First Name Field -->
  <Form.Field {form} name="firstName">
    <Form.Control>
      <Form.Label>{m.settings_first_name()}</Form.Label>
      <Input
        name="firstName"
        placeholder={m.settings_enter_new_first_name()}
        bind:value={$formData.firstName}
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Last Name Field -->
  <Form.Field {form} name="lastName">
    <Form.Control>
      <Form.Label>{m.settings_last_name()}</Form.Label>
      <Input
        name="lastName"
        placeholder={m.settings_enter_new_last_name()}
        bind:value={$formData.lastName}
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  {#if $message}
    <div class="text-red-500 bg-red-100 border border-red-400 rounded p-4">
      {$message}
    </div>
  {/if}

  <!-- Action Buttons -->
  <div class="grid md:grid-cols-2 sm:flex-row gap-4">
    <Form.Button class="w-full capitalize font-semibold" disabled={$submitting}>
      {#if $submitting}
        {m.saving()}
      {:else}
        {m.save_changes()}
      {/if}
    </Form.Button>
    <a href="/settings" class="md:order-first">
      <Form.Button
        class="w-full capitalize font-semibold"
        variant="outline_secondary"
        type="button"
        asChild>{m.cancel()}</Form.Button
      >
    </a>
  </div>

  <!-- Success Dialog -->
  <AlertDialog
    title={m.dialog_title()}
    imageSrc="/images/yellow-profile.svg"
    description={m.settings_new_name_saved()}
    open={isSuccessDialogOpen}
    onClose={() => (isSuccessDialogOpen = false)}
  />
</form>
