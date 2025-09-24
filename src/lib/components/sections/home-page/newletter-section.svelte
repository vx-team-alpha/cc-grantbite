<script lang="ts">
  import { m } from "$lib/paraglide/messages"
  import { NewsLetterForm, type NewsLetterFormType } from "$src/lib/schemas"
  import { superForm, type Infer } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import * as Form from "$lib/components/ui/form/index.js"
  import Input from "../../ui/input/input.svelte"
  import AlertDialog from "../../ui/custom/alert-dialog.svelte"
  import { toast } from "svelte-sonner"

  const defaultData: Infer<NewsLetterFormType> = {
    email: "",
    funding_guide: false,
    sub_newsletter: true,
  }
  let isSuccessDialogOpen = $state(false)
  const form = superForm(defaultData, {
    validators: zodClient(NewsLetterForm),
    onUpdated: ({ form }) => {
      if (form.valid && !form.message) {
        toast.success(m.toast_letter_sub())
      }
    },
  })

  const { form: formData, enhance, message, submitting } = form
</script>

<div class="relative z-10 flex items-center justify-center px-4 mb-20">
  <div class="w-full max-w-7xl mx-auto">
    <div
      class="bg-brand-primary-dark rounded-2xl p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden"
      style="background-image: url('/images/newletter-bg.png'); background-size: cover;"
    >
      <!-- Background Overlay -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full opacity-50"
      ></div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col items-center">
        <div class="text-center mb-8 max-w-4xl">
          <h4 class="text-white font-bold text-bodylg">
            {m.newsletter_title()}
          </h4>
        </div>

        <form
          method="POST"
          action="/account/api?/subNewsLetter"
          use:enhance
          class="space-y-5 sm:space-y-12 w-full"
        >
          <!-- Checkboxes -->
          <div
            class="flex flex-col sm:flex-row space-x-6 justify-center sm:items-start"
          >
            <Form.Field {form} name="sub_newsletter">
              <Form.Control>
                <div class="flex items-center space-x-3">
                  <input
                    id="sub_newsletter"
                    name="sub_newsletter"
                    type="checkbox"
                    class="border-2 border-white/30 w-5 h-5 accent-brand-dark-orange cursor-pointer"
                    bind:checked={$formData.sub_newsletter}
                  />
                  <label
                    for="sub_newsletter"
                    class="text-white text-body6 font-medium cursor-pointer"
                  >
                    {m.newsletter_subscribe_newsletter()}
                  </label>
                </div>
              </Form.Control>
              <Form.FieldErrors class="text-red-500" />
            </Form.Field>

            <Form.Field {form} name="funding_guide">
              <Form.Control>
                <div class="flex items-center space-x-3">
                  <input
                    id="funding_guide"
                    name="funding_guide"
                    type="checkbox"
                    class="border-2 border-white/30 w-5 h-5 accent-brand-dark-orange cursor-pointer"
                    bind:checked={$formData.funding_guide}
                  />
                  <label
                    for="funding_guide"
                    class="text-white text-body6 font-medium cursor-pointer"
                  >
                    {m.newsletter_send_funding_guide()}
                  </label>
                </div>
              </Form.Control>
              <Form.FieldErrors class="text-red-500" />
            </Form.Field>
          </div>

          <!-- Email Input and Submit -->

          <div class="relative max-w-3xl mx-auto">
            <Form.Field {form} name="email">
              <Form.Control>
                <Input
                  type="email"
                  name="email"
                  placeholder={m.newsletter_your_email()}
                  bind:value={$formData.email}
                  required
                  class="w-full h-12 md:h-14 text-base md:text-lg bg-white px-1.5 pl-4 sm:pl-6"
                />
              </Form.Control>
              <Form.FieldErrors class="text-red-500 absolute" />
            </Form.Field>
            <Form.Button
              variant="secondary"
              disabled={$submitting}
              class="absolute right-1 top-1 bottom-1 my-auto rounded-md  text-white font-semibold h-10 md:h-12 px-10 md:px-14"
            >
              {m.newsletter_send()}
            </Form.Button>
          </div>
          {#if $message}
            <p class="text-red-500">{$message}</p>
          {/if}
        </form>
      </div>
    </div>
  </div>
</div>

<AlertDialog
  title="Newsletter Subscribe"
  imageSrc="/images/yellow-tick.svg"
  description="You have subscribed to the newsletter."
  open={isSuccessDialogOpen}
  onClose={() => (isSuccessDialogOpen = false)}
/>
