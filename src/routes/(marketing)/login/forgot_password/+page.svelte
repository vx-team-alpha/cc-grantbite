<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte"
  import { sharedAppearance, oauthProviders } from "../login_config"

  let { data } = $props()
</script>

<svelte:head>
  <title>Forgot Password</title>
</svelte:head>
<div class="bg-white p-4 md:p-12 border border-brand-border rounded-2xl">
  <h1 class="text-2xl font-bold mb-6">Forgot Password</h1>
  <Auth
    supabaseClient={data.supabase}
    view="forgotten_password"
    redirectTo={`${data.url}/auth/callback?next=%2Faccount%2Fsettings%2Freset_password`}
    providers={oauthProviders}
    socialLayout="horizontal"
    showLinks={false}
    appearance={sharedAppearance}
    additionalData={undefined}
  />
  <div class="text-l text-slate-800 mt-4">
    Remember your password? <a class="underline" href="/login/session"
      >Sign in</a
    >.
  </div>
</div>
