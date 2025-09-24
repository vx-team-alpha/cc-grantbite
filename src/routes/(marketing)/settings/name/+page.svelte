<script lang="ts">
  import ChangeNameForm from "$lib/components/forms/change-name-form.svelte"
  import type { PageData } from "./$types"
  import SettingNestFormsLayout from "../setting-nest-forms-layout.svelte"
  import { m } from "$lib/paraglide/messages" // ✅ for translations

  export let data: PageData
</script>

<svelte:head>
  <title>{m.settings_change_name_title()}</title>
</svelte:head>

<SettingNestFormsLayout
  headline={m.settings_change_name_title()}
  subheadline={m.settings_change_name_info()}
>
  <ChangeNameForm data={data.form} />
</SettingNestFormsLayout>
