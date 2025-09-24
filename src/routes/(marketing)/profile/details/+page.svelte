<script lang="ts">
  import ChangeCompanyDetailsEmp from "$lib/components/forms/change-company-details-emp.svelte"
  import type { PageData } from "./$types"
  import ProfileNestFormsLayout from "../profile-nest-forms-layout.svelte"
  import { m } from "$lib/paraglide/messages" // Paraglide for translations

  export let data: PageData
</script>

<svelte:head>
  <title>{m.change_company_details_title()}</title>
</svelte:head>

<ProfileNestFormsLayout
  headline={m.change_company_details_headline()}
  subheadline={m.change_company_details_subheadline()}
>
  <ChangeCompanyDetailsEmp data={data.form} />
</ProfileNestFormsLayout>
