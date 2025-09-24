<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import { m } from "$src/lib/paraglide/messages"
  import { getLocale } from "$src/lib/paraglide/runtime"

  type Props = {
    type: "Register" | "Login"
  }

  let { type }: Props = $props()
  let message = $state("")
  let isLoading = $state(false)
  const currentLocale = getLocale()
  const handleSubmit = (provider: string) => {
    isLoading = true
    message = ""
    const form = document.createElement("form")
    form.method = "POST"
    form.action = `/${currentLocale}/account/api?/socialLogin&provider=${provider}`
    document.body.appendChild(form)
    form.submit()
  }
</script>

<div class="space-y-5">
  {#if message}
    <div class="text-red-500 bg-red-100 border border-red-400 rounded p-4">
      {message}
    </div>
  {/if}

  <!-- No need for <form> tag anymore unless fallback needed -->
  <Button
    size="lg"
    variant="ghost"
    class="w-full flex items-center justify-center font-semibold gap-2.5 border border-brand-gray hover:bg-brand-gray/10"
    onclick={() => handleSubmit("google")}
    disabled={isLoading}
  >
    <img
      src="/images/google-icon.svg"
      alt="google icon"
      width="30"
      height="30"
    />
    {#if type === "Register"}
      {m.register_with_google()}
    {:else}
      {m.login_with_google()}
    {/if}
  </Button>

  <Button
    size="lg"
    variant="ghost"
    class="w-full flex items-center justify-center font-semibold gap-2.5 border border-brand-gray hover:bg-brand-gray/10"
    onclick={() => handleSubmit("linkedin_oidc")}
    disabled={isLoading}
  >
    <img
      src="/images/linkedin-icon.svg"
      alt="linkedin icon"
      width="30"
      height="30"
    />
    {#if type === "Register"}
      {m.register_with_linkedIn()}
    {:else}
      {m.login_with_linkedIn()}
    {/if}
  </Button>
</div>
