<script lang="ts">
  import type { PageData } from "../../../../routes/(marketing)/funding/[permalink]/$types"
  import type {
    FundingContact,
    FundingProgramWithTranslation,
  } from "$lib/db_translation_helper"

  import * as enums from "$lib/data_values/enums"
  import { translators } from "$lib/translators"
  import { m } from "$lib/paraglide/messages"
  import { ShowSourceUrl } from "$src/config"
  import Inforow from "./inforow.svelte"

  let { data }: { data: PageData } = $props()

  const program: FundingProgramWithTranslation = data.program
  const contact = program.contact as FundingContact
</script>

<div class="space-y-3.5 rounded-b-[10px] text-sm text-black leading-[30px]">
  <Inforow
    label={m.funding_provider_program_level()}
    hasValue={!!program.provider_program_level}
    >{translators.translateProgramLevel(
      program.provider_program_level as enums.ProgramLevel,
    )}</Inforow
  >

  <Inforow
    label={m.funding_provider_funding_body()}
    hasValue={!!program.provider_funding_body}
    >{program.provider_funding_body}</Inforow
  >
  <Inforow
    hasValue={!!program.provider_managed_by}
    label={m.search_result_card_managed_by()}
    >{program.provider_managed_by}</Inforow
  >
  <Inforow
    hasValue={!!program.provider_additional_partners}
    label={m.funding_provider_additional_partners()}
    >{program.provider_additional_partners}</Inforow
  >
  <Inforow
    hasValue={!!contact.website}
    label={m.funding_provider_contact_website()}
  >
    <a
      href={contact?.website?.url}
      target="_blank"
      rel="noopener noreferrer"
      class="hover:underline font-bold text-[#3965F5]"
      >{contact?.website?.name}</a
    ></Inforow
  >
  <Inforow
    hasValue={ShowSourceUrl && !!program.src_url}
    label={m.funding_provider_source()}
  >
    <a
      href={program.src_url}
      target="_blank"
      rel="noopener noreferrer"
      class="hover:underline font-medium text-[#3965F5]">URL</a
    >
  </Inforow>
</div>
