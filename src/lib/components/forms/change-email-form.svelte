<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { ChangeEmailSchema, type ChangeEmailSchemaType } from "$lib/schemas"
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import AlertDialog from "../ui/custom/alert-dialog.svelte"
  import { m } from "$src/lib/paraglide/messages"

  const { data } = $props<{
    data: SuperValidated<Infer<ChangeEmailSchemaType>>
  }>()

  let isSuccessDialogOpen = $state(false)
  let successMessage = $state(false)

  const form = superForm(data, {
    validators: zodClient(ChangeEmailSchema),
    resetForm: false,
    onUpdated: ({ form }) => {
      if (form.valid && !form.message) {
        isSuccessDialogOpen = true
        successMessage = true
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
  <!-- Email Field -->
  <Form.Field {form} name="email">
    <Form.Control>
      <Form.Label>{m.email()}</Form.Label>

      <Input
        name="email"
        type="email"
        placeholder={m.settings_enter_new_email()}
        bind:value={$formData.email}
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Password Field -->
  <Form.Field {form} name="password">
    <Form.Control>
      <Form.Label>{m.password()}</Form.Label>

      <Input
        name="password"
        type="password"
        placeholder={m.password()}
        bind:value={$formData.password}
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

  <!-- Success Info Message -->
  {#if successMessage}
    <div
      class="text-green-500 bg-green-100 border border-green-400 rounded p-4"
    >
      {m.settings_email_updated()}
    </div>
  {/if}

  <!-- Buttons -->
  <div class="grid md:grid-cols-2 sm:flex-row gap-4">
    <Form.Button class="w-full font-semibold">
      {#if $submitting}
        {m.saving()}
      {:else}
        {m.settings_change_email_button()}
      {/if}
    </Form.Button>

    <a href="/settings" class="md:order-first">
      <Form.Button
        class="w-full font-semibold "
        variant="outline_secondary"
        type="button"
        asChild>{m.cancel()}</Form.Button
      >
    </a>
  </div>
</form>

<!-- Success Dialog -->
<AlertDialog
  title={m.settings_email_confirmation_sent()}
  imageSrc="/images/yellow-mail.svg"
  description={m.settings_email_confirmation_description()}
  open={isSuccessDialogOpen}
  onClose={() => (isSuccessDialogOpen = false)}
/>
