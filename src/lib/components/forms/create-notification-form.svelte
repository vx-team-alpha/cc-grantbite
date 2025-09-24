<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { CreateNotification, type CreateNotificationType } from "$lib/schemas"
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js"
  import Checkbox from "../ui/checkbox/checkbox.svelte"
  import Textarea from "../ui/textarea/textarea.svelte"
  import Slider from "../ui/slider/slider.svelte"
  import AlertDialog from "../ui/custom/alert-dialog.svelte"
  import { Label } from "../ui/label"
  import CalendarIcon from "@lucide/svelte/icons/calendar"
  import { DateFormatter, type DateValue } from "@internationalized/date"
  import { cn, formatNumber } from "$lib/utils.js"
  import { buttonVariants } from "$lib/components/ui/button/index.js"
  import { Calendar } from "$lib/components/ui/calendar/index.js"
  import * as Popover from "$lib/components/ui/popover/index.js"
  import MultiSelectFilter from "../MultiSelectFilter.svelte"
  import { fundingPurpose, industries, stages } from "$lib/components/constants"
  import { goto, invalidate } from "$app/navigation"
  import { toast } from "svelte-sonner"
  import { m } from "$src/lib/paraglide/messages"

  let value = $state<DateValue | undefined>()
  const { data, id } = $props<{
    data: SuperValidated<Infer<CreateNotificationType>>
    id?: string
  }>()
  let isSuccessDialogOpen = $state(false)

  const shouldResetForm = Boolean(!id)

  const form = superForm(data, {
    validators: zodClient(CreateNotification),
    resetForm: shouldResetForm,
    onUpdated: async ({ form }) => {
      if (form.valid && !form.message) {
        await invalidate("/en/notifications")
        if (shouldResetForm) {
          toast.success(m.toast_created())
        } else {
          toast.success(m.toast_updated())
        }
        goto("/notifications")
      }
    },
    onError: ({ result }) => {
      console.error("Form submission error:", result)
    },
  })

  const { form: formData, enhance, message, submitting } = form
  const sliderMin = 10000
  const sliderMax = 3000000
  const sliderStep = 1000
  const actionPath = id
    ? "/account/api?/updateNotification"
    : "/account/api?/createNotification"
</script>

<form
  method="POST"
  action={actionPath}
  use:enhance
  class="space-y-7 text-start"
>
  <input type="hidden" name="id" value={id} />

  <!-- Project Name -->
  <Form.Field {form} name="projectName">
    <Form.Control>
      <Form.Label class="mb-2.5">{m.form_project_name_label()}</Form.Label>
      <Input
        name="projectName"
        placeholder={m.form_project_name_placeholder()}
        bind:value={$formData.projectName}
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Industry Multi-Select -->
  <Form.Field {form} name="industry">
    <Form.Control>
      <Label for="industry">{m.form_industry_label()}</Label>
      <MultiSelectFilter
        filterLabel={m.form_industry_select_placeholder()}
        filterOptions={industries}
        bind:filterValues={$formData.industry}
        on:change={({ detail }) => ($formData.industry = detail)}
        buttonClass="border border-brand-light-gray "
        dropdownClass="bg-gray-50"
        optionClass="hover:!bg-blue-100"
        maxOptionsDisplayed={2}
      />
    </Form.Control>
    {#each $formData.industry as industryValue, i}
      <input type="hidden" name="industry" value={industryValue} />
    {/each}
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Project Type -->
  <Form.Field {form} name="projectType">
    <p class="text-sm font-medium mb-2.5">{m.form_project_type_question()}</p>
    <RadioGroup.Root bind:value={$formData.projectType} name="projectType">
      <Form.Control>
        <div class="grid sm:grid-cols-2 gap-5">
          <div class="flex items-center space-x-2">
            <RadioGroup.Item value="single-applicant" id="single-applicant" />
            <Label for="single-applicant">{m.form_project_type_single()}</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroup.Item
              value="consortium-required"
              id="consortium-required"
            />
            <Label for="consortium-required"
              >{m.form_project_type_consortium_required()}</Label
            >
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroup.Item
              value="optional-consortium"
              id="optional-consortium"
            />
            <Label for="optional-consortium"
              >{m.form_project_type_optional_consortium()}</Label
            >
          </div>
        </div>
      </Form.Control>
    </RadioGroup.Root>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Start & End Dates -->
  <div class="flex flex-col">
    <p class="text-sm font-medium mb-2.5">{m.form_dates_question()}</p>
    <div class="flex max-md:flex-col gap-4">
      <Form.Field {form} name="startDate" class="grow sm:w-1/2">
        <Form.Control>
          {#snippet children({ props })}
            <Popover.Root>
              <Popover.Trigger
                {...props}
                name="startDate"
                class={cn(
                  buttonVariants({ variant: "outline_secondary" }),
                  "w-full justify-start px-4 text-left font-normal border border-brand-gray ",
                  !$formData.startDate && "text-brand-light-gray",
                )}
              >
                {$formData.startDate || m.form_start_date_placeholder()}
                <CalendarIcon class="ml-auto size-4 opacity-50" />
              </Popover.Trigger>
              <Popover.Content class="w-auto p-0 bg-white">
                <Calendar
                  type="single"
                  value={value as DateValue}
                  onValueChange={(v) =>
                    ($formData.startDate = v ? v.toString() : "")}
                />
              </Popover.Content>
            </Popover.Root>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors class="text-red-500" />
        <input hidden value={$formData.startDate} name="startDate" />
      </Form.Field>

      <Form.Field {form} name="endDate" class="grow sm:w-1/2">
        <Form.Control>
          {#snippet children({ props })}
            <Popover.Root>
              <Popover.Trigger
                {...props}
                name="endDate"
                class={cn(
                  buttonVariants({ variant: "outline_secondary" }),
                  "w-full justify-start px-4 text-left font-normal border border-brand-gray",
                  !$formData.endDate && "text-brand-light-gray",
                )}
              >
                {$formData.endDate || m.form_end_date_placeholder()}
                <CalendarIcon class="ml-auto size-4 opacity-50" />
              </Popover.Trigger>
              <Popover.Content class="w-auto p-0 bg-white">
                <Calendar
                  type="single"
                  value={value as DateValue}
                  onValueChange={(v) =>
                    ($formData.endDate = v ? v.toString() : "")}
                />
              </Popover.Content>
            </Popover.Root>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors class="text-red-500" />
        <input hidden value={$formData.endDate} name="endDate" />
      </Form.Field>
    </div>
  </div>

  <!-- Project Stage Checkboxes -->
  <Form.Fieldset {form} name="projectStage">
    <Form.Legend class="text-sm font-medium mb-2.5">
      {m.form_stage_question()}
    </Form.Legend>

    <div class="flex flex-wrap gap-4">
      {#each stages as stage}
        {@const isChecked = $formData.projectStage?.includes(stage.value)}
        <div class="flex items-center space-x-2">
          <Form.Control>
            {#snippet children({ props })}
              <Checkbox
                {...props}
                class="text-white"
                name="projectStage"
                value={stage.value}
                checked={isChecked}
                onCheckedChange={(checked) => {
                  if (checked) {
                    $formData.projectStage = [
                      ...($formData.projectStage || []),
                      stage.value,
                    ]
                  } else {
                    $formData.projectStage = (
                      $formData.projectStage || []
                    ).filter((v: string) => v !== stage.value)
                  }
                }}
              />
              <Form.Label for={stage.value} class="font-normal cursor-pointer">
                {stage.label}
              </Form.Label>
            {/snippet}
          </Form.Control>
        </div>
      {/each}
    </div>

    <Form.FieldErrors class="text-red-500" />
  </Form.Fieldset>

  <!-- Description -->
  <Form.Field {form} name="description">
    <Form.Control>
      <Form.Label class="mb-2.5">{m.form_description_label()}</Form.Label>
      <Textarea
        name="description"
        class="resize-none"
        placeholder={m.form_description_placeholder()}
        bind:value={$formData.description}
      />
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Budget -->

  <Form.Field {form} name="projectBudget">
    <Form.Control>
      <Form.Label class="mb-2.5">{m.form_budget_label()}</Form.Label>
      <div class="w-full px-2">
        <Slider
          type="multiple"
          bind:value={$formData.projectBudget}
          min={sliderMin}
          max={sliderMax}
          step={sliderStep}
          class="w-full"
        />
        <div class="flex justify-between text-sm text-muted-foreground mt-2">
          <span>{m.form_budget_min()}</span>
          <div class="flex gap-2 text-sm font-medium">
            <span class="text-primary"
              >{m.form_budget_from()} €{formatNumber(
                $formData.projectBudget?.[0] ?? sliderMin,
              )}</span
            >
            <span class="text-primary"
              >{m.form_budget_to()} €{formatNumber(
                $formData.projectBudget?.[1] ?? sliderMax,
              )}</span
            >
          </div>
          <span>{m.form_budget_max()}</span>
        </div>
      </div>
      {#if Array.isArray($formData.projectBudget)}
        <input
          type="hidden"
          name="projectBudget"
          value={$formData.projectBudget[0]}
        />
        <input
          type="hidden"
          name="projectBudget"
          value={$formData.projectBudget[1]}
        />
      {/if}
    </Form.Control>
    <Form.FieldErrors class="text-red-500" />
  </Form.Field>

  <!-- Funding Purpose -->
  <Form.Fieldset {form} name="fundingPurpose">
    <Form.Legend class="text-sm font-medium mb-2.5"
      >{m.form_funding_purpose_question()}</Form.Legend
    >
    <div class="grid sm:grid-cols-3 gap-4">
      {#each fundingPurpose as funding}
        {@const checked = $formData.fundingPurpose.includes(funding.value)}
        <div class="flex items-center space-x-2">
          <Form.Control>
            {#snippet children({ props })}
              <Checkbox
                {...props}
                class="text-white"
                value={funding.value}
                {checked}
                onCheckedChange={(v) => {
                  if (v)
                    $formData.fundingPurpose = [
                      ...$formData.fundingPurpose,
                      funding.value,
                    ]
                  else
                    $formData.fundingPurpose = $formData.fundingPurpose.filter(
                      (i: string) => i !== funding.value,
                    )
                }}
              />
              <Form.Label for={funding.value} class="font-normal cursor-pointer"
                >{funding.label}</Form.Label
              >
            {/snippet}
          </Form.Control>
        </div>
      {/each}
    </div>
    <Form.FieldErrors class="text-red-500" />
  </Form.Fieldset>

  {#if $message}
    <div class="text-red-500 bg-red-100 border border-red-400 rounded p-4">
      {$message}
    </div>
  {/if}

  <!-- Actions -->
  <div class="grid md:grid-cols-2 gap-4">
    <Form.Button class="w-full  font-semibold" disabled={$submitting}>
      {#if $submitting}
        {m.form_saving()}
      {:else}
        {m.form_save_button()}
      {/if}
    </Form.Button>
    <a href="/notifications" class="md:order-first">
      <Form.Button
        class="w-full  font-semibold"
        variant="outline_secondary"
        type="button"
        asChild>{m.form_cancel_button()}</Form.Button
      >
    </a>
  </div>
</form>

<AlertDialog
  title={m.alert_title()}
  imageSrc="/images/yellow-tick.svg"
  description={m.alert_description()}
  open={isSuccessDialogOpen}
  onClose={() => (isSuccessDialogOpen = false)}
/>
