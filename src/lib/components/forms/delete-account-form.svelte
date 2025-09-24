<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import {
    DeleteAccountSchema,
    type DeleteAccountSchemaType,
  } from "$lib/schemas"
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { Textarea } from "../ui/textarea"
  import AlertDialog from "../ui/custom/alert-dialog.svelte"
  import { m } from "$src/lib/paraglide/messages"

  const { data } = $props<{
    data: SuperValidated<Infer<DeleteAccountSchemaType>>
  }>()

  let isSuccessDialogOpen = $state(false)

  const form = superForm(data, {
    validators: zodClient(DeleteAccountSchema),
    resetForm: true,
    onUpdated: ({ form }) => {
      if (form.valid && !form.message) {
        isSuccessDialogOpen = true
      }
    },
  })
  const { form: formData, enhance, message, submitting } = form
</script>

<form
  method="POST"
  use:enhance
  action="/account/api?/deleteAccount2"
  class="w-full space-y-7 text-start max-w-[610px]"
>
  <Form.Field {form} name="email">
    <Form.Control>
      <Form.Label>{m.delete_account_email_label()}</Form.Label>
      <Input
        name="email"
        type="email"
        placeholder={m.delete_account_email_placeholder()}
        bind:value={$formData.email}
      />
    </Form.Control>

    <Form.FieldErrors class="text-red-500" />
  </Form.Field>
  <Form.Field {form} name="password">
    <Form.Control>
      <Form.Label>{m.password()}</Form.Label>
      <Input
        name="password"
        type="password"
        placeholder={m.delete_account_password_placeholder()}
        bind:value={$formData.password}
      />
    </Form.Control>

    <Form.FieldErrors class="text-red-500" />
  </Form.Field>
  <Form.Field {form} name="reason">
    <Form.Control>
      <Form.Label>{m.delete_account_reason_label()}</Form.Label>
      <Textarea
        name="reason"
        class="resize-none"
        placeholder={m.delete_account_reason_placeholder()}
        bind:value={$formData.reason}
      />
    </Form.Control>

    <Form.FieldErrors class="text-red-500" />
  </Form.Field>
  {#if $message}
    <div class="text-red-500 bg-red-100 border border-red-400 rounded p-4">
      {$message}
    </div>
  {/if}
  <div class="grid md:grid-cols-2 sm:flex-row gap-4">
    <Form.Button disabled={$submitting} class="w-full  font-semibold"
      >{m.delete_account_confirm_button()}</Form.Button
    >
    <a href="/settings" class="md:order-first">
      <Form.Button
        class="w-full  font-semibold "
        variant="outline_secondary"
        type="button"
        asChild>{m.cancel()}</Form.Button
      >
    </a>
  </div>
</form>

<AlertDialog
  title={m.delete_account_dialog_title()}
  imageSrc="/images/yellow-mail.svg"
  description={m.delete_account_dialog_description()}
  open={isSuccessDialogOpen}
  onClose={() => (isSuccessDialogOpen = false)}
/>
