<script lang="ts">
  import ProfileCard from "$lib/components/cards/profile-card.svelte"
  import type {
    CompanyAddress,
    CompanyDetails,
    CompanyInfo,
  } from "$lib/db_translation_helper"
  import type { PageData } from "./$types.js"
  import { m } from "$lib/paraglide/messages" // ✅ Import translation helper

  const props = $props<{
    data: PageData
  }>()
  const profileDetails = props.data.data
  const companyInfo = (props.data.data?.company_info as CompanyInfo) ?? {}
  const companyDetails =
    (props.data.data?.company_details as CompanyDetails) ?? {}
  const companyAddress =
    (props.data.data?.company_address as CompanyAddress) ?? {}

  type Section = {
    name: string
    fields: {
      label: string
      value: string
    }[]
    btnTxt: string
    link: string
  }

  const sections: Section[] = [
    {
      name: m.section_company(),
      fields: [
        {
          label: m.label_official_company_name(),
          value: profileDetails?.company_name || "—",
        },
        {
          label: m.label_registration_number(),
          value: companyInfo.registration_no || "—",
        },
        {
          label: m.label_company_type(),
          value: companyInfo.company_type || "—",
        },
      ],
      btnTxt: m.btn_edit_details(),
      link: "/profile/company",
    },
    {
      name: m.section_address(),
      fields: [
        {
          label: m.label_company_address(),
          value:
            [companyAddress.street || "", companyAddress.area || ""]
              .filter(Boolean)
              .join(", ") || "—",
        },
        {
          label: m.label_zip(),
          value: companyAddress.zipcode || "—",
        },
        {
          label: m.label_city(),
          value: companyAddress.city || "—",
        },
      ],
      btnTxt: m.btn_edit_details(),
      link: "/profile/address",
    },
    {
      name: m.section_details(),
      fields: [
        {
          label: m.label_year_founded(),
          value: companyDetails.founded_year || "—",
        },
        {
          label: m.label_number_of_employees(),
          value: companyDetails.employees
            ? `${companyDetails.employees[0]} - ${companyDetails.employees[1]}`
            : "—",
        },
        {
          label: m.label_revenue_last_year(),
          value: companyDetails.revenue || "—",
        },
      ],
      btnTxt: m.btn_edit_details(),
      link: "/profile/details",
    },
  ]
</script>

<svelte:head>
  <title>{m.page_title_profile()}</title>
</svelte:head>

<div class="flex flex-col app-container space-y-7 py-7">
  <h3 class="text-3xl font-bold">{m.page_title_profile()}</h3>
  {#each sections as section}
    <ProfileCard
      name={section.name}
      fields={section.fields}
      btnTxt={section.btnTxt}
      link={section.link}
    />
  {/each}
</div>
