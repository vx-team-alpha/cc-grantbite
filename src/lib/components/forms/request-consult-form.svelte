<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { ReqConsultForm, type ReqConsultFormType } from "$lib/schemas"
  import { type Infer, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Dialog from "$lib/components/ui/dialog/index.js"
  import Button from "../ui/button/button.svelte"
  import Textarea from "../ui/textarea/textarea.svelte"
  import { toast } from "svelte-sonner"
  import { m } from "$src/lib/paraglide/messages"

  interface Props {
    title: string
    btxTxt?: string
    varient?:
      | "secondary"
      | "default"
      | "primary"
      | "destructive"
      | "outline"
      | "outline_secondary"
      | "ghost"
    program_id?: string
  }

  const data: Props = $props()
  const {
    title,
    btxTxt = m.request_consultation_button(),
    varient = "secondary",
    program_id,
  } = data

  const defaultData: Infer<ReqConsultFormType> = {
    email: "",
    program: title,
    program_id: program_id || "",
    message: "",
    name: "",
  }
  let dialogOpen = $state(false)

  const form = superForm(defaultData, {
    validators: zodClient(ReqConsultForm),
    resetForm: false,
    onUpdated: ({ form }) => {
      if (form.valid && !form.message) {
        toast.success(m.toast_req_submit())
        dialogOpen = false
      }
    },
  })

  const { form: formData, enhance, submitting, message } = form
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger class="w-full inline-flex">
    <Button class="w-full inline-flex" variant={varient}>{btxTxt}</Button>
  </Dialog.Trigger>

  <Dialog.Content
    class="sm:max-w-2xl bg-white max-h-[calc(100vh-80px)] overflow-y-scroll"
  >
    <div class="py-4 px-3.5 rounded-xl max-w-2xl space-y-2.5">
      <h3 class="font-bold text-xl sm:text-3xl text-center">
        {m.request_free_consultation_title()}
      </h3>
      <p class="text-body-2 text-center">
        {m.request_free_consultation_desc()}
      </p>
      <form
        method="POST"
        use:enhance
        action="/account/api?/consultRequest"
        class="flex flex-col gap-7 w-full text-start"
      >
        <Form.Field {form} name="program">
          <Form.Control>
            <Form.Label>{m.funding_program()}</Form.Label>
            <Input
              placeholder={m.enter_program()}
              class=" bg-gray-300 cursor-not-allowed"
              value={$formData.program}
              disabled={true}
            />
            <Input
              type="hidden"
              name="program"
              placeholder={m.enter_program()}
              class=" bg-gray-300 cursor-not-allowed"
              value={$formData.program}
            />
          </Form.Control>
          <Form.FieldErrors class="text-red-500" />
        </Form.Field>

        <Form.Field {form} name="program_id" class="hidden">
          <Form.Control>
            <Input
              type="hidden"
              name="program_id"
              bind:value={$formData.program_id}
            />
          </Form.Control>
        </Form.Field>

        <Form.Field {form} name="name">
          <Form.Legend>{m.name()}</Form.Legend>
          <Form.Control>
            <Input
              name="name"
              placeholder={m.enter_name()}
              bind:value={$formData.name}
            />
          </Form.Control>
          <Form.FieldErrors class="text-red-500" />
        </Form.Field>

        <Form.Field {form} name="email">
          <Form.Legend>{m.email()}</Form.Legend>
          <Form.Control>
            <Input
              type="email"
              name="email"
              placeholder={m.enter_email()}
              bind:value={$formData.email}
            />
          </Form.Control>
          <Form.FieldErrors class="text-red-500" />
        </Form.Field>

        <Form.Field {form} name="message">
          <Form.Legend>{m.message()}</Form.Legend>
          <Form.Control>
            <Textarea
              name="message"
              placeholder={m.enter_message()}
              class="resize-none"
              bind:value={$formData.message}
            />
          </Form.Control>
          <Form.FieldErrors class="text-red-500" />
        </Form.Field>
        {#if $message}
          <div
            class="text-red-500 bg-red-100 border border-red-400 rounded p-4"
          >
            {$message}
          </div>
        {/if}
        <Form.Button
          size="lg"
          disabled={$submitting}
          class="w-full max-w-[250px] ms-auto font-semibold h-10.5"
        >
          {m.submit()}
        </Form.Button>
      </form>
    </div>
  </Dialog.Content>
</Dialog.Root>
