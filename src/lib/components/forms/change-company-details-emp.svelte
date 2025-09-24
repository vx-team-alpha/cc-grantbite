<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import {
    ChangeCompanyDetailsEmp,
    type ChangeCompanyDetailsEmpType,
  } from "$lib/schemas"
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { Slider } from "$lib/components/ui/slider/index.js"
  import AlertDialog from "../ui/custom/alert-dialog.svelte"
  import { goto, invalidate } from "$app/navigation"
  import { localizeHref } from "$src/lib/paraglide/runtime"
  import { toast } from "svelte-sonner"
  import { m } from "$lib/paraglide/messages"

  const { data } = $props<{
    data: SuperValidated<Infer<ChangeCompanyDetailsEmpType>>
  }>()

  let isSuccessDialogOpen = $state(false)

  const form = superForm(data, {
    validators: zodClient(ChangeCompanyDetailsEmp),
    resetForm: false,
    onUpdated: async ({ form }) => {
      if (form.valid && !form.message) {
        toast.success(m.change_company_details_success())
        await invalidate(localizeHref("/profile"))
        goto(localizeHref("/profile"))
      }
    },
  })

  const { form: formData, enhance, message, submitting } = form

  const sliderMin = 10
  const sliderMax = 1000
  const sliderStep = 10
</script>

<form
  method="POST"
  use:enhance
  class="w-full space-y-7 text-start max-w-[610px]"
>
  <!-- Founded Year -->
  <Form.Field {form} name="foundedYear">
    <Form.Control>
      <Form.Label>{m.founded_year_label()}</Form.Label>
      <Input
        name="foundedYear"
        type="text"
        placeholder={m.founded_year_placeholder()}
        bind:value={$formData.foundedYear}
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Number of Employees (Range Slider) -->
  <Form.Field {form} name="numberEmployee">
    <Form.Control>
      <Form.Label class="mb-4">{m.number_of_employees_label()}</Form.Label>

      <div class="w-full px-2">
        <input
          type="hidden"
          name="numberEmployee"
          value={$formData.numberEmployee?.[0] ?? ""}
        />
        <input
          type="hidden"
          name="numberEmployee"
          value={$formData.numberEmployee?.[1] ?? ""}
        />

        <Slider
          type="multiple"
          bind:value={$formData.numberEmployee}
          min={sliderMin}
          max={sliderMax}
          step={sliderStep}
          class="w-full"
        />

        <div class="flex justify-between text-sm text-muted-foreground mt-2">
          <span>{sliderMin}</span>
          <div class="flex gap-2 text-sm font-medium">
            <span class="text-primary">
              {m.range_from()}: {$formData.numberEmployee?.[0] ?? sliderMin}
            </span>
            <span class="text-primary">
              {m.range_to()}: {$formData.numberEmployee?.[1] ?? sliderMax}
            </span>
          </div>
          <span>{sliderMax}</span>
        </div>
      </div>
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Revenue Last Year -->
  <Form.Field {form} name="revenueLastYear">
    <Form.Control>
      <Form.Label>{m.revenue_last_year_label()}</Form.Label>

      <Input
        type="text"
        name="revenueLastYear"
        placeholder={m.revenue_last_year_placeholder()}
        bind:value={$formData.revenueLastYear}
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Submit Button -->
  <div class="grid md:grid-cols-2 sm:flex-row gap-4">
    <Form.Button class="w-full font-semibold"
      >{#if $submitting}
        {m.saving()}
      {:else}
        {m.save_changes()}
      {/if}</Form.Button
    >
    <a href="/profile" class="md:order-first">
      <Form.Button
        class="w-full font-semibold "
        variant="outline_secondary"
        type="button"
        asChild>{m.cancel()}</Form.Button
      >
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
