<script lang="ts">
  import SocialButtons from "./social-buttons.svelte"
  import * as Form from "$lib/components/ui/form"
  import { SignUpForm, type SignUpFormType } from "$lib/schemas"
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import Input from "$lib/components/ui/input/input.svelte"
  import { toast } from "svelte-sonner"
  import { redirect } from "@sveltejs/kit"
  import { localizeUrl } from "$src/lib/paraglide/runtime"
  import { m } from "$src/lib/paraglide/messages"
  import { cn } from "$src/lib/utils"

  const { data } = $props<{
    data: SuperValidated<Infer<SignUpFormType>>
  }>()

  const form = superForm(data, {
    validators: zodClient(SignUpForm),
    onUpdated: ({ form }) => {
      if (form.valid && !form.message) {
        toast.success(m.toast_reg_success(), { duration: 7000 })
        redirect(303, localizeUrl("/funding"))
      }
    },
  })

  const { form: formData, enhance, message, submitting } = form
</script>

<div class="flex flex-col gap-7 w-full max-w-[610px] mx-auto">
  <!-- Social Logins -->

  <SocialButtons type="Register" />
  <div
    class="py-3 flex items-center text-xl text-brand-light-gray before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6"
  >
    {m.or()}
  </div>
  <div class="flex flex-col justify-center gap-7">
    <h4 class="font-medium text-xl">
      {m.register_with_email()}
    </h4>
    <form
      method="POST"
      action="?/signUp"
      use:enhance
      class="w-full space-y-7 text-start max-w-[610px]"
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
      <Form.Field {form} name="firstName">
        <Form.Control>
          <Input
            name="firstName"
            type="text"
            placeholder={m.first_name()}
            bind:value={$formData.firstName}
          />
        </Form.Control>

        <Form.FieldErrors class="text-red-500" />
      </Form.Field>
      <Form.Field {form} name="lastName">
        <Form.Control>
          <Input
            name="lastName"
            type="text"
            placeholder={m.last_name()}
            bind:value={$formData.lastName}
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
        <div class="w-full">
          <ul
            class="grid sm:grid-cols-2 gap-y-2 sm:gap-x-8 md:pl-5 list-disc list-inside text-sm md:text-base text-start"
          >
            <li>{m.password_condition_1()}</li>
            <li>{m.password_condition_2()}</li>
            <li>{m.password_condition_3()}</li>
            <li>{m.password_condition_4()}</li>
          </ul>
        </div>
      </Form.Field>
      {#if $message}
        <div class="text-red-500 bg-red-100 border border-red-400 rounded p-4">
          {$message}
        </div>
      {/if}
      <Form.Button
        class={cn("w-full font-semibold", $submitting && "cursor-not-allowed")}
        disabled={$submitting}>{m.signup()}</Form.Button
      >
    </form>

    <p>
      {m.by_registering()}
      <a
        href="/privacy-policy"
        class="cursor-pointer text-sm text-start sm:text-center sm:text-base"
      >
        <span class="text-blue-500 hover:underline">
          {m.terms_conditions()}</span
        ></a
      >
    </p>
  </div>
</div>
