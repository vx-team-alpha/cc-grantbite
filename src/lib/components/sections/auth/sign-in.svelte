<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"
  import SocialButtons from "./social-buttons.svelte"
  import * as Form from "$lib/components/ui/form"
  import { SignInForm, type SignInFormType } from "$lib/schemas"
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { toast } from "svelte-sonner"
  import { goto, invalidate } from "$app/navigation"
  import { m } from "$src/lib/paraglide/messages"
  import { localizeHref } from "$src/lib/paraglide/runtime"
  import { cn } from "$src/lib/utils"

  const { data } = $props<{
    data: SuperValidated<Infer<SignInFormType>>
  }>()

  const form = superForm(data, {
    validators: zodClient(SignInForm),
    onUpdated: async ({ form }) => {
      if (form.valid && !form.message) {
        toast.success(m.toast_sign_success())
        await invalidate("supabase:auth")
        setTimeout(() => {
          goto(localizeHref("/funding"), { invalidate: ["/funding"] })
        }, 1)
      }
    },
  })

  const { form: formData, enhance, message, submitting } = form
</script>

<div class="flex flex-col gap-7 w-full max-w-[610px] mx-auto">
  <div class="flex flex-col justify-center gap-7">
    <form
      method="POST"
      action="?/signIn"
      use:enhance
      class="w-full space-y-7 text-start"
    >
      <Form.Field {form} name="email">
        <Form.Control>
          <Input
            name="email"
            type="email"
            placeholder={m.email_address()}
            bind:value={$formData.email}
          />
        </Form.Control>

        <Form.FieldErrors class="text-red-500" />
      </Form.Field>
      <Form.Field {form} name="password">
        <Form.Control>
          <Input
            name="password"
            type="password"
            placeholder={m.password()}
            bind:value={$formData.password}
          />
        </Form.Control>
        <Form.FieldErrors class="text-red-500" />
      </Form.Field>
      {#if $message}
        <div class="text-red-500 bg-red-100 border border-red-400 rounded p-4">
          {$message}
        </div>
      {/if}
      <Form.Button
        class={cn("w-full font-semibold", $submitting && "cursor-not-allowed")}
        disabled={$submitting}>{m.signin()}</Form.Button
      >
    </form>

    <p class="text-sm text-start sm:text-center sm:text-base">
      <a class="hover:underline" href="/login/forgot-password"
        >{m.forgot_password()}
      </a>
    </p>
  </div>
  <!-- divider -->
  <div
    class="py-3 flex items-center text-xl text-brand-light-gray before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6"
  >
    {m.or()}
  </div>
  <!-- Social Logins -->

  <SocialButtons type="Login" />
</div>
