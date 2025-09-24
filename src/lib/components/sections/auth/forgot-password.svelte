<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { ForgotPassword, type ForgotPasswordType } from "$lib/schemas"
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import Input from "$lib/components/ui/input/input.svelte"
  import { localizeHref } from "$src/lib/paraglide/runtime"
  import { m } from "$src/lib/paraglide/messages"

  const { data } = $props<{
    data: SuperValidated<Infer<ForgotPasswordType>>
  }>()
  let sentEmail = $state(false)
  const form = superForm(data, {
    validators: zodClient(ForgotPassword),
    onUpdated: ({ form }) => {
      if (form.valid) {
        sentEmail = true
      }
    },
  })

  const { form: formData, enhance, message, submitting } = form
</script>

<!-- Social Logins -->

<div class="max-w-[732px] flex flex-col justify-center gap-4">
  <h4 class="font-bold text-3xl">{m.forgot_password()}</h4>
  <p class="text-base">{m.email_reset_instructions()}</p>
  <form
    method="POST"
    action="?/forgotPassword"
    use:enhance
    class="space-y-7 text-start mt-3 max-w-xl w-full mx-auto"
  >
    <Form.Field {form} name="email">
      <Form.Control>
        <Input
          name="email"
          type="email"
          placeholder={m.enter_email()}
          bind:value={$formData.email}
        />
      </Form.Control>

      <Form.FieldErrors class="text-red-500" />
    </Form.Field>
    {#if $message}
      <div class="text-red-500 bg-red-100 border border-red-400 rounded p-4">
        {$message}
      </div>
    {/if}
    {#if sentEmail}
      <div
        class="text-green-600 bg-green-100 border border-green-400 rounded p-4"
      >
        Password reset instructions sent to your email.
      </div>
    {/if}
    <Form.Button disabled={$submitting} class="w-full font-semibold"
      >{m.send_reset_password_instructions()}</Form.Button
    >
    <span>
      {m.remember_password()}?
      <a href="/login/sign_up" class="hover:underline"> {m.signin()} </a></span
    >
  </form>
</div>
