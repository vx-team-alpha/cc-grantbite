<script lang="ts">
  import { invalidate } from "$app/navigation"
  import { onMount } from "svelte"

  let { data, children } = $props()
  let layoutState = $state(data)
  $effect(() => {
    if (data) {
      layoutState = data
    } else {
      console.warn("No data provided to account layout")
    }
  })

  onMount(() => {
    const authStateRes = layoutState?.supabase.auth.onAuthStateChange(
      (event, _session) => {
        if (_session?.expires_at !== layoutState?.session?.expires_at) {
          invalidate("supabase:auth")
        }
      },
    )

    return () => authStateRes?.data?.subscription.unsubscribe()
  })
</script>

{@render children?.()}
