<script lang="ts">
  import DeleteAccountForm from "$lib/components/forms/delete-account-form.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { ArrowLeft } from "lucide-svelte"

  import type { PageData } from "./$types"
  import SettingNestFormsLayout from "../setting-nest-forms-layout.svelte"
  import { m } from "$src/lib/paraglide/messages"
  export let data: PageData
</script>

<svelte:head>
  <title>{m.settings_delete_account_title()}</title>
</svelte:head>

<SettingNestFormsLayout
  headline={m.settings_delete_account_headline()}
  subheadline={m.settings_delete_account_subheadline()}
>
  <DeleteAccountForm data={data.form} />
</SettingNestFormsLayout>
