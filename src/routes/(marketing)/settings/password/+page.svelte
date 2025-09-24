<script lang="ts">
  import ChangePasswordForm from "$lib/components/forms/change-password-form.svelte"

  import type { PageData } from "./$types"
  import SettingNestFormsLayout from "../setting-nest-forms-layout.svelte"
  import { m } from "$src/lib/paraglide/messages"
  export let data: PageData
</script>

<svelte:head>
  <title>{m.settings_change_password_title()}</title>
</svelte:head>

<SettingNestFormsLayout
  headline={m.settings_change_password_title()}
  subheadline={m.setting_change_subheading()}
>
  <ChangePasswordForm data={data.form} />
</SettingNestFormsLayout>
