<script>
  import { m } from "../paraglide/messages"
  import { localizeHref } from "../paraglide/runtime"
  import ActiveLink from "./active-link.svelte"
</script>

<div
  class="w-full max-w-[610px] mx-auto mb-12 flex items-center justify-start gap-8"
>
  <ActiveLink
    href={localizeHref("/login/sign_up")}
    className="text-xl pb-3 px-6 border-b-2 border-transparent hover:text-brand-primary hover:border-brand-primary"
    activeClass="border-b-2 !text-brand-primary border-brand-primary"
  >
    {m.signup()}
  </ActiveLink>
  <ActiveLink
    href={localizeHref("/login/sign_in")}
    className="text-xl pb-3 px-6 border-b-2 border-transparent hover:text-brand-primary hover:border-brand-primary"
    activeClass="border-b-2 !text-brand-primary border-brand-primary"
  >
    {m.signin()}
  </ActiveLink>
</div>
