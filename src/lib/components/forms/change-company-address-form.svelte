<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js"
  import { Input } from "$lib/components/ui/input/index.js"
  import {
    ChangeCompanyAddress,
    type ChangeCompanyAddressType,
  } from "$lib/schemas"
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
  import { m } from "$lib/paraglide/messages"

  const { data } = $props<{
    data: SuperValidated<Infer<ChangeCompanyAddressType>>
  }>()

  let isSuccessDialogOpen = $state(false)
  const form = superForm(
    {
      street: data.data.street || "",
      country: data.data.country || "",
      zipcode: data.data.zipcode || "",
      city: data.data.city || "",
    },
    {
      validators: zodClient(ChangeCompanyAddress),
      resetForm: false,
      onUpdated: async ({ form }) => {
        if (form.valid && !form.message) {
          toast.success(m.changes_saved_success())
          await invalidate(localizeHref("/profile"))
          goto(localizeHref("/profile"))
        }
      },
    },
  )

  const { form: formData, enhance, message, submitting } = form
</script>

<svelte:head>
  <title>{m.change_address_title()}</title>
</svelte:head>

<form
  method="POST"
  use:enhance
  class="w-full space-y-7 text-start max-w-[610px]"
>
  <Form.Field {form} name="street">
    <Form.Control>
      <Form.Label>{m.field_street()}</Form.Label>
      <Input
        name="street"
        placeholder={m.field_street_placeholder()}
        bind:value={$formData.street}
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <Form.Field {form} name="city">
    <Form.Control>
      <Form.Label>{m.field_city()}</Form.Label>
      <Input
        name="city"
        placeholder={m.field_city_placeholder()}
        bind:value={$formData.city}
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <Form.Field {form} name="zipcode">
    <Form.Control>
      <Form.Label>{m.field_postal_code()}</Form.Label>
      <Input
        name="zipcode"
        type="text"
        placeholder={m.field_postal_code_placeholder()}
        bind:value={$formData.zipcode}
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <Form.Field {form} name="country">
    <Form.Control>
      <Form.Label>{m.field_country()}</Form.Label>
      <Input
        name="country"
        placeholder={m.field_country_placeholder()}
        bind:value={$formData.country}
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
    <Form.Button class="w-full font-semibold">
      {#if $submitting}
        {m.saving()}
      {:else}
        {m.save_changes()}
      {/if}
    </Form.Button>
    <a href="/profile" class="md:order-first">
      <Form.Button
        class="w-full font-semibold"
        variant="outline_secondary"
        type="button"
        asChild
      >
        {m.cancel()}
      </Form.Button>
    </a>
  </div>
</form>

<AlertDialog
  title={m.dialog_title()}
  imageSrc="/images/yellow-tick.svg"
  description={m.dialog_description()}
  open={isSuccessDialogOpen}
  onClose={() => (isSuccessDialogOpen = false)}
/>
