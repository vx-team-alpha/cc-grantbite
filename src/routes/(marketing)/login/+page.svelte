<script>
  import { m } from "$lib/paraglide/messages"
  import { localizeHref } from "$lib/paraglide/runtime"
</script>

<svelte:head>
  <title>Log In</title>
</svelte:head>

<div>
  <h1 class="text-xl font-bold">Get Started</h1>
  <a href={localizeHref("/login/sign_up")}
    ><button class="btn btn-primary mt-3 btn-wide">{m.navbar_register()}</button
    ></a
  >

  <h1 class="text-xl mt-6">Already have an account?</h1>
  <a href={localizeHref("/login/sign_in")}
    ><button class="btn btn-outline btn-primary mt-3 btn-wide"
      >{m.navbar_login()}</button
    ></a
  >
</div>
