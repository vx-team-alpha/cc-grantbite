<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import {
    ChangeCompanyDetails,
    type ChangeCompanyDetailsType,
  } from "$lib/schemas"
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import AlertDialog from "../ui/custom/alert-dialog.svelte"
  import { toast } from "svelte-sonner"
  import { goto, invalidate } from "$app/navigation"
  import { localizeHref } from "$src/lib/paraglide/runtime"
  import { m } from "$lib/paraglide/messages" // i18n translations

  const { data } = $props<{
    data: SuperValidated<Infer<ChangeCompanyDetailsType>>
  }>()

  let isSuccessDialogOpen = $state(false)

  const form = superForm(data, {
    validators: zodClient(ChangeCompanyDetails),
    resetForm: false,
    onUpdated: async ({ form }) => {
      if (form.valid && !form.message) {
        toast.success(m.toast_changes_saved()) // translated toast
        await invalidate(localizeHref("/profile"))
        goto(localizeHref("/profile"))
      }
    },
  })
  const { form: formData, enhance, message, submitting } = form
</script>

<form
  method="POST"
  use:enhance
  class="w-full space-y-7 text-start max-w-[610px]"
>
  <!-- Company Official -->
  <Form.Field {form} name="name">
    <Form.Control>
      <Form.Label>{m.company_official_label()}</Form.Label>
      <Input
        placeholder={m.company_official_placeholder()}
        bind:value={$formData.name}
        name="name"
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Registration Number -->
  <Form.Field {form} name="registrationNo">
    <Form.Control>
      <Form.Label>{m.company_registration_label()}</Form.Label>
      <Input
        type="text"
        placeholder={m.company_registration_placeholder()}
        bind:value={$formData.registrationNo}
        name="registrationNo"
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Company Type -->
  <Form.Field {form} name="type">
    <Form.Control>
      <Form.Label>{m.company_type_label()}</Form.Label>
      <Input
        type="text"
        placeholder={m.company_type_placeholder()}
        bind:value={$formData.type}
        name="type"
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Error Message -->
  {#if $message}
    <div class="text-red-500 bg-red-100 border border-red-400 rounded p-4">
      {$message}
    </div>
  {/if}

  <!-- Buttons -->
  <div class="grid md:grid-cols-2 sm:flex-row gap-4">
    <Form.Button class="w-full font-semibold">
      {#if $submitting}
        {m.saving()}
      {:else}
        {m.save_changes_text()}
      {/if}
    </Form.Button>
    <a href={localizeHref("/profile")} class="md:order-first">
      <Form.Button
        class="w-full font-semibold"
        variant="outline_secondary"
        type="button"
        asChild>{m.cancel()}</Form.Button
      >
    </a>
  </div>
</form>

<!-- Success Dialog -->
<AlertDialog
  title={m.dialog_title()}
  imageSrc="/images/yellow-tick.svg"
  description={m.dialog_description()}
  open={isSuccessDialogOpen}
  onClose={() => (isSuccessDialogOpen = false)}
/>
