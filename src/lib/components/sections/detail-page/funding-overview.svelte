<script lang="ts">
  import ClockBlue from "$lib/assets/clock-blue-icon.svg"
  import FundingStatusIcon from "$lib/assets/funding-status-icon.svg"
  import BankNoteBlue from "$lib/assets/bank-note-blue.svg"
  import EuroSign from "$lib/assets/euro-sign.svg"
  import NoteBlue from "$lib/assets/note-blue.svg"
  import HourGlassBlue from "$lib/assets/hourglass-blue.svg"
  import AwardBlue from "$lib/assets/award-blue.svg"
  import GlobeBlue from "$lib/assets/globe-blue.svg"
  import SectersBlue from "$lib/assets/hospital-blue.svg"
  import DuoIconsBlue from "$lib/assets/duo-icons-blue.svg"
  import CoinsBlue from "$lib/assets/coins-blue.svg"

  import type { PageData } from "../../../../routes/(marketing)/funding/[permalink]/$types"
  import type { FundingProgramWithTranslation } from "$lib/db_translation_helper"
  import InfoRow from "./inforow.svelte"

  import * as enums from "$lib/data_values/enums"
  import { translators } from "$lib/translators"
  import { m } from "$lib/paraglide/messages"

  let { data }: { data: PageData } = $props()

  const program = data.program as unknown as FundingProgramWithTranslation
  // const meta = data.meta
</script>

<div class="space-y-4 rounded-b-[10px] text-black h-full">
  <InfoRow
    icon={FundingStatusIcon}
    label={m.search_result_card_funding_status()}
    hasValue={!!program.program_status}
    >{translators.translateProgramStatus(
      program.program_status as enums.ProgramStatus,
    )}</InfoRow
  >
  <InfoRow
    icon={BankNoteBlue}
    label={m.search_result_card_maximum_amount()}
    hasValue={!!program.overview_maximum_funding_amount}
    >{program.overview_maximum_funding_amount}</InfoRow
  >
  <InfoRow
    icon={EuroSign}
    label={m.search_result_card_allocated_budget()}
    hasValue={!!program.overview_allocated_budget}
    >{program.overview_allocated_budget}</InfoRow
  >
  <InfoRow
    icon={ClockBlue}
    label={m.search_result_card_deadline()}
    hasValue={!!program.overview_deadline}>{program.overview_deadline}</InfoRow
  >

  <InfoRow
    icon={HourGlassBlue}
    label={m.funding_overview_open_until()}
    hasValue={!!program.overview_open_until}
    >{program.overview_open_until}</InfoRow
  >
  <InfoRow
    icon={AwardBlue}
    label={m.funding_overview_award_channel()}
    hasValue={!!program.overview_award_channel}
  >
    {translators.translateAwardChannel(
      program.overview_award_channel as enums.AwardChannel,
    )}
  </InfoRow>

  <InfoRow
    icon={GlobeBlue}
    label={m.funding_overview_region()}
    hasValue={!!program.overview_region}>{program.overview_region}</InfoRow
  >
  <InfoRow
    icon={SectersBlue}
    label={m.search_result_card_sectors()}
    hasValue={program.overview_eligible_sectors_short &&
      program.overview_eligible_sectors_short.length > 0}
    >{program.overview_eligible_sectors_short
      .map((t) => t as enums.EligibleSectorsShort)
      .map((t) => translators.translateEligibleSectorsShort(t))
      .join(", ")}</InfoRow
  >

  <InfoRow
    icon={DuoIconsBlue}
    label={m.search_result_card_beneficiaries()}
    hasValue={!!program.overview_beneficiary?.length}
    >{program.overview_beneficiary}</InfoRow
  >
  <InfoRow
    icon={NoteBlue}
    label={m.search_result_card_application_type()}
    hasValue={!!program.overview_single_consortium}
    >{translators.translateSingleConsortium(
      program.overview_single_consortium as enums.SingleConsortium,
    )}
  </InfoRow>

  <InfoRow
    icon={CoinsBlue}
    label={m.funding_overview_funding_stages()}
    hasValue={!!program.overview_target_stages_short?.length}
    >{program.overview_target_stages_short
      .map((t) => t as enums.TargetStageShort)
      .map((t) => translators.translateTargetStageShort(t))
      .join(", ")}</InfoRow
  >
</div>
