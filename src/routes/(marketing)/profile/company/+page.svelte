<script lang="ts">
  import ChangeCompanyDetailsForm from "$src/lib/components/forms/change-company-form.svelte"

  import type { PageData } from "./$types"
  import ProfileNestFormsLayout from "../profile-nest-forms-layout.svelte"
  import { m } from "$src/lib/paraglide/messages"
  let { data }: { data: PageData } = $props()
</script>

<svelte:head>
  <title>{m.change_company_details_title()}</title>
</svelte:head>

<ProfileNestFormsLayout
  headline={m.change_company_details_title()}
  subheadline={m.change_company_details_subheadline()}
>
  <ChangeCompanyDetailsForm data={data.form} />
</ProfileNestFormsLayout>
