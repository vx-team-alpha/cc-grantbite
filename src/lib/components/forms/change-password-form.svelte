<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import {
    ChangePasswordSchema,
    type ChangePasswordSchemaType,
  } from "$lib/schemas"
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import AlertDialog from "../ui/custom/alert-dialog.svelte"
  import { page } from "$app/state"
  import Button from "../ui/button/button.svelte"
  import { m } from "$lib/paraglide/messages" // ✅ Translation import

  const { data } = $props<{
    data: SuperValidated<Infer<ChangePasswordSchemaType>>
  }>()

  let isSuccessDialogOpen = $state(false)

  const form = superForm(data, {
    validators: zodClient(ChangePasswordSchema),
    resetForm: false,
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
  action="/account/api?/updatePassword2"
  class="w-full space-y-7 text-start max-w-[610px]"
>
  <!-- Current Password -->
  <Form.Field {form} name="currentPassword">
    <Form.Control>
      <Form.Label>{m.settings_current_password()}</Form.Label>

      <Input
        name="currentPassword"
        type="password"
        placeholder={m.settings_enter_current_password()}
        bind:value={$formData.currentPassword}
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- New Password -->
  <Form.Field {form} name="newPassword">
    <Form.Control>
      <Form.Label>{m.settings_new_password()}</Form.Label>
      <Input
        name="newPassword"
        type="password"
        placeholder={m.settings_enter_new_password()}
        bind:value={$formData.newPassword}
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Confirm Password -->
  <Form.Field {form} name="confirmPassword">
    <Form.Control>
      <Form.Label>{m.settings_confirm_new_password()}</Form.Label>
      <Input
        name="confirmPassword"
        type="password"
        placeholder={m.settings_confirm_new_password_placeholder()}
        bind:value={$formData.confirmPassword}
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Password Rules -->
  <div class="w-full sm:w-fit">
    <ul
      class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-x-8 list-disc list-inside text-sm md:text-base"
    >
      <li>{m.settings_password_rule_8_chars()}</li>
      <li>{m.settings_password_rule_lowercase()}</li>
      <li>{m.settings_password_rule_number()}</li>
      <li>{m.settings_password_rule_uppercase()}</li>
    </ul>
  </div>

  <!-- Success / Error Message -->
  {#if $message}
    <div
      class={page.status >= 400
        ? "text-red-500 bg-red-100 border border-red-400 rounded p-4"
        : "text-green-500 bg-green-100 border border-green-400 rounded p-4"}
    >
      {$message}
    </div>
  {/if}

  <!-- Buttons -->
  <div class="grid md:grid-cols-2 sm:flex-row gap-4">
    <Form.Button class="w-full font-semibold">
      {#if $submitting}
        {m.saving()}
      {:else}
        {m.save_changes()}
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
  title={m.dialog_title()}
  imageSrc="/images/yellow-lock.svg"
  description={m.settings_password_updated_description()}
  open={isSuccessDialogOpen}
  onClose={() => (isSuccessDialogOpen = false)}
>
  <Button class="max-w-[250px]" asChild>
    <a href="/">{m.settings_back_to_home()}</a>
  </Button>
</AlertDialog>
