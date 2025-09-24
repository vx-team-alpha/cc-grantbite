<script lang="ts">
  import SignUp from "$lib/components/sections/auth/sign-up.svelte"
  import SessionTabLinks from "$src/lib/components/session-tab-links.svelte"

  import type { PageData } from "./$types"

  const { data } = $props<{
    data: PageData
  }>()
</script>

<svelte:head>
  <title>Session</title>
  <meta
    name="description"
    content="Create an account or sign in to access your funding opportunities."
  />
</svelte:head>

<div
  class="w-full max-w-[732px] rounded-2xl border border-brand-border p-3 md:p-9"
>
  <SessionTabLinks />
  <SignUp data={data.SignUpform} />
</div>
