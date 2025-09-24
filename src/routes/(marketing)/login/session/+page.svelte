<script lang="ts">
  import SignUp from "$lib/components/sections/auth/sign-up.svelte"
  import SignIn from "$lib/components/sections/auth/sign-in.svelte"
  import * as Tabs from "$lib/components/ui/tabs/index.js"
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

<div class="w-full max-w-3xl rounded-2xl border border-brand-border p-3 md:p-9">
  <Tabs.Root value="sign-up" class="w-full">
    <Tabs.List class="flex items-center md:items-start md:w-fit mb-7">
      <Tabs.Trigger value="sign-up" class="text-xl font-normal">
        Sign up
      </Tabs.Trigger>
      <Tabs.Trigger value="sign-in" class="text-xl font-normal">
        Sign in
      </Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="sign-up" class="w-full p-4">
      <SignUp data={data.SignUpform} />
    </Tabs.Content>

    <Tabs.Content value="sign-in" class="w-full p-4">
      <SignIn data={data.SignInform} />
    </Tabs.Content>
  </Tabs.Root>
</div>
