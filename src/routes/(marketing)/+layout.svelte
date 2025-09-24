<script lang="ts">
  import "../../app.css"
  // import { localizeHref } from "$lib/utils/localization"

  import NavbarSection from "$lib/components/sections/home-page/navbar.svelte"
  import FooterSection from "$lib/components/sections/home-page/footer-section.svelte"
  import { onMount } from "svelte"
  import { invalidate } from "$app/navigation"

  let { children, data } = $props()
  let { session, supabase, user } = $derived(data)

  let isAuthenticated = $derived(session !== null && user !== null)
  onMount(() => {
    const authres = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })
    return () => authres?.data.subscription.unsubscribe()
  })
</script>

<div class="flex flex-col min-h-screen bg-brand-white">
  <NavbarSection {isAuthenticated} />
  <div class="flex-grow bg-white">
    {@render children?.()}
  </div>

  <FooterSection />
</div>
