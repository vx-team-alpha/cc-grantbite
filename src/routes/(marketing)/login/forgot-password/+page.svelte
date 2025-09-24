<script lang="ts">
  import type { PageData } from "./$types"
  import ForgotPassword from "$src/lib/components/sections/auth/forgot-password.svelte"
  const { data } = $props<{
    data: PageData
  }>()
</script>

<svelte:head>
  <title>Forgot Password</title>
</svelte:head>

<div class="w-full max-w-3xl rounded-2xl border border-brand-border p-3 md:p-9">
  <ForgotPassword data={data.ForgotPassword} />
</div>
