<script lang="ts">
  import ChangeCompanyAddressForm from "$lib/components/forms/change-company-address-form.svelte"
  import type { PageData } from "./$types"
  import ProfileNestFormsLayout from "../profile-nest-forms-layout.svelte"
  import { m } from "$lib/paraglide/messages"

  let { data }: { data: PageData } = $props()
</script>

<svelte:head>
  <title>{m.page_title_change_company_address()}</title>
</svelte:head>

<ProfileNestFormsLayout
  headline={m.headline_change_address()}
  subheadline={m.subheadline_update_info()}
>
  <ChangeCompanyAddressForm data={data.form} />
</ProfileNestFormsLayout>
