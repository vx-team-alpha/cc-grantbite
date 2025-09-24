<script lang="ts">
  import ChangeEmailForm from "$lib/components/forms/change-email-form.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { ArrowLeft } from "lucide-svelte"
  import type { PageData } from "./$types"
  import SettingNestFormsLayout from "../setting-nest-forms-layout.svelte"
  import { m } from "$src/lib/paraglide/messages"
  export let data: PageData
</script>

<svelte:head>
  <title>{m.settings_change_email_title()}</title>
</svelte:head>

<SettingNestFormsLayout
  headline={m.settings_change_email_title()}
  subheadline={m.setting_email_subheading()}
>
  <ChangeEmailForm data={data.form} />
</SettingNestFormsLayout>
