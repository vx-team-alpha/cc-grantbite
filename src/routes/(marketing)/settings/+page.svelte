<script lang="ts">
  import SettingCard from "$lib/components/cards/setting-card.svelte"
  import type { PageData } from "./$types"
  import { m } from "$lib/paraglide/messages"

  const props = $props<{
    data: PageData
  }>()
  const firstName = props.data.data?.first_name
  const lastName = props.data.data?.last_name
  const email = props.data.user?.email || ""
  const provider = props.data.user?.app_metadata?.provider || "default"

  type Section = {
    type: "name" | "email" | "password" | "delete"
    name: string
    fields: {
      label: string
      value: string
    }[]
    btnTxt: string
    link: string
    info: string
    provider?: string
  }

  const sections: Section[] = [
    {
      type: "name",
      name: m.settings_change_name_title(),
      fields: [
        { label: m.settings_first_name(), value: firstName },
        { label: m.settings_last_name(), value: lastName },
      ],
      btnTxt: m.settings_change_name_button(),
      link: "/settings/name",
      info: "",
    },
    {
      type: "email",
      name: m.settings_change_email_title(),
      fields: [{ label: m.settings_email(), value: email }],
      btnTxt: m.settings_change_email_button(),
      link: "/settings/email",
      info: "",
    },
    {
      type: "password",
      name: m.settings_change_password_title(),
      fields: [],
      btnTxt: m.settings_change_password_button(),
      link: "/settings/password",
      info: m.settings_change_password_info(),
      provider: provider,
    },
    {
      type: "delete",
      name: m.settings_delete_account_title(),
      fields: [],
      btnTxt: m.settings_delete_account_button(),
      link: "/settings/delete",
      info: m.settings_delete_account_info(),
    },
  ]
</script>

<svelte:head>
  <title>{m.settings_title()}</title>
</svelte:head>

<div class="flex flex-col app-container space-y-7 py-7">
  <h3 class="text-3xl font-bold">{m.settings_title()}</h3>
  {#each sections as section}
    <SettingCard data={section} />
  {/each}
</div>
