<script lang="ts">
  import { ArrowRight, Bookmark, MessageSquare } from "lucide-svelte"
  import BankNote from "$lib/assets/banlnote.svg"
  import Building from "$lib/assets/building.svg"
  import Chart from "$lib/assets/chart.svg"
  import Clock from "$lib/assets/clock.svg"
  import DB from "$lib/assets/db.svg"
  import Globe from "$lib/assets/globe.svg"
  import HandCoin from "$lib/assets/handcoin.svg"

  import FinancialInstrumentType from "$lib/components/FinancialInstrumentType.svelte"
  import ProgramStatus from "$lib/components/ProgramStatus.svelte"
  import ReadMore from "./ReadMore.svelte"
  import { localizeHref } from "$lib/paraglide/runtime"
  import Button from "./ui/button/button.svelte"
  import * as enums from "$lib/data_values/enums"
  import { translators } from "$lib/translators"
  import { m } from "$lib/paraglide/messages"
  import { cn } from "$lib/utils"
  import RequestConsultForm from "./forms/request-consult-form.svelte"
  import type {
    FundingProgramWithTranslation,
    SearchResultItem,
  } from "$lib/db_translation_helper"
  import FundingBookmark from "./funding-bookmark.svelte"

  interface FoerderdatenbankItem {
    url: string
    updated_at: string
    title: string | null
    introduction_short: string | null
    // md_content: string; // Not directly used in card, but could be for a modal
    overview_maximum_funding_amount: string | null
    overview_financial_instrument: string | null
    // overview_award_channel: string | null;
    overview_deadline: string | null
    overview_open_until: string | null
    overview_region: string | null
    overview_eligible_sectors_short: string[] | null
    overview_beneficiary: string | null
    // overview_target_stages_short: string[] | null;
    // provider_program_level: string | null;
    provider_funding_body: string | null
    provider_managed_by: string | null
    // provider_additional_partners: string | null;
    permalink: string
    program_status?: string | null // Assuming this field might exist for "Current"
    featured_priority: number
  }

  // Type for the search result card - using relevant fields from the joined type
  type SearchResultItem = Pick<
    FundingProgramWithTranslation,
    | "updated_at"
    | "title"
    | "introduction_short"
    | "overview_maximum_funding_amount"
    | "overview_financial_instrument"
    | "overview_deadline"
    | "overview_open_until"
    | "overview_region"
    | "overview_eligible_sectors_short"
    | "overview_beneficiary"
    | "provider_funding_body"
    | "provider_managed_by"
    | "permalink"
    | "program_status"
    | "featured_priority"
    | "id"
    | "bookmarked"
  >

  let { item, isChat = false }: { item: SearchResultItem; isChat?: boolean } =
    $props()

  // No longer needed as we're using the ProgramStatus component
  // let isCurrent = $derived(
  //   item.program_status === "aktiv" || item.program_status === "laufend",
  // ) // Placeholder logic

  function formatCurrency(value: string | null) {
    if (!value) return "-"
    // Assuming value might be like "Bis zu 150.000 € p.a." or just "5,000,000 €"
    // This is a naive extraction, might need refinement
    const match = value.match(/([\d.,]+)\s*€/)
    if (match && match[1]) {
      return `${match[1]} €`
    }
    return value
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "-"
    // Assuming date might be DD.MM.YYYY or YYYY-MM-DD
    if (dateString.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
      return dateString
    }
    if (dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
      const [year, month, day] = dateString.split("T")[0].split("-")
      return `${day}.${month}.${year}`
    }
    return dateString
  }

  const deadline = $derived(
    formatDate(item.overview_deadline || item.overview_open_until),
  )
</script>

<div
  class={cn(
    "relative bg-white border border-gray-300 rounded-2xl p-6 w-full max-w-7xl  my-4 font-exo ",
    item.featured_priority > 0 ? "border-3 border-brand-blue" : "",
  )}
>
  <!-- Program Status Badge -->
  {#if !isChat && item.program_status}
    <div class="absolute top-0 right-[7%] transform -translate-y-1/2">
      <ProgramStatus status={item.program_status as enums.ProgramStatus} />
    </div>
  {/if}

  <!-- Top Right Badges/Icons -->
  {#if !isChat}
    <div class="absolute top-6 right-6 flex items-center space-x-3">
      <FundingBookmark
        actionPath="/account/api?/bookmark"
        id={item.id}
        isChecked={item.bookmarked}
      />
    </div>
  {/if}

  <!-- Category Tags -->
  <div class="flex space-x-2 mb-4">
    <div class="flex gap-2">
      {#if item.overview_financial_instrument}
        <FinancialInstrumentType
          type={item.overview_financial_instrument as enums.FinancialInstrumentType}
        />
      {/if}
    </div>
  </div>

  <!-- Title -->
  <h3 class="text-body-1 font-bold text-black mb-2 font-exo">
    {item.title || "No Title Provided"}
  </h3>

  <!-- Description -->
  <div class="text-body-2 text-gray-700 mb-6 font-exo leading-relaxed">
    <ReadMore
      textContent={item.introduction_short || "No summary available."}
      maxWords={100}
    />
  </div>

  <!-- Details Grid -->
  <div class="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-8 text-sm">
    <!-- Left Column -->
    <div class="space-y-4">
      {#if item.overview_region}
        <div class="flex items-start">
          <img
            src={Globe}
            alt="globe"
            class="w-5 h-5 mr-3 text-teal-600 flex-shrink-0"
          />

          <p>
            <span class="font-normal text-body-2">{m.filters_region()}:</span>
            <span class="font-semibold text-body-2">
              {item.overview_region}
            </span>
          </p>
        </div>
      {/if}
      {#if item.overview_beneficiary}
        <div class="flex items-start">
          <img
            src={Building}
            alt="building"
            class="w-5 h-5 mr-3 text-teal-600 flex-shrink-0"
          />
          <span class="font-semibold text-body-2"
            ><stspanrong class="font-normal text-body-2"
              >{m.search_result_card_beneficiaries()}:</stspanrong
            >
            {item.overview_beneficiary}</span
          >
        </div>
      {/if}
      {#if item.overview_eligible_sectors_short && item.overview_eligible_sectors_short.length > 0}
        <div class="flex">
          <img
            src={Chart}
            alt="globe"
            class="w-5 h-5 mr-3 text-teal-600 flex-shrink-0"
          />
          <span class="font-semibold text-body-2"
            ><span class="font-normal text-body-2"
              >{m.search_result_card_sectors()}:</span
            >
            {item.overview_eligible_sectors_short
              .map((t) => t as enums.EligibleSectorsShort)
              .map((t) => translators.translateEligibleSectorsShort(t))
              .join(", ")}</span
          >
        </div>
      {/if}
      {#if item.overview_maximum_funding_amount}
        <div class="flex items-start">
          <img
            src={BankNote}
            alt="globe"
            class="w-5 h-5 mr-3 text-teal-600 flex-shrink-0"
          />
          <span class="font-semibold text-body-2"
            ><span class="font-normal text-body-2"
              >{m.search_result_card_maximum_amount()}:</span
            >
            {formatCurrency(item.overview_maximum_funding_amount)}</span
          >
        </div>
      {/if}
    </div>

    <!-- Right Column -->
    <div class="space-y-3">
      {#if deadline && deadline !== "-"}
        <div class="flex items-start">
          <img
            src={Clock}
            alt="globe"
            class="w-5 h-5 mr-3 text-teal-600 flex-shrink-0"
          />
          <span class="font-semibold text-body-2"
            ><span class="font-normal text-body-2"
              >{m.search_result_card_deadline()}:</span
            >
            {deadline}</span
          >
        </div>
      {/if}
      {#if item.provider_funding_body}
        <div class="flex items-start">
          <img
            src={DB}
            alt="globe"
            class="w-5 h-5 mr-3 text-teal-600 flex-shrink-0"
          />
          <span class="font-semibold text-body-2"
            ><span class="font-normal text-body-2"
              >{m.search_result_card_funding_provider()}:</span
            >
            {item.provider_funding_body}</span
          >
        </div>
      {/if}
      {#if item.provider_managed_by}
        <div class="flex items-start">
          <img
            src={HandCoin}
            alt="HandCoin"
            class="w-5 h-5 mr-3 text-teal-600 flex-shrink-0"
          />
          <span class="font-semibold text-body-2"
            ><span class="font-normal text-body-2"
              >{m.search_result_card_managed_by()}:</span
            >
            {item.provider_managed_by}</span
          >
        </div>
      {/if}
    </div>
  </div>
  <!-- Show Details Button -->
  <div
    class={cn(
      "flex flex-col md:flex-row-reverse  items-center mb-3 gap-4",
      item.featured_priority > 0
        ? "justify-center"
        : "justify-center md:justify-start",
    )}
  >
    <a
      href={localizeHref(`/funding/${item.permalink}`)}
      class=" w-full max-w-[250px] flex justify-end"
    >
      <Button
        asChild
        size={!isChat ? "lg" : "icon"}
        class={cn(
          isChat ? "size-11" : "w-full  flex items-center justify-center",
        )}
      >
        {#if !isChat}
          {m.search_result_card_show_details()}
        {:else}
          <ArrowRight />
        {/if}
      </Button>
    </a>
    {#if item.featured_priority > 0}
      <div class="w-full max-w-[250px]">
        <RequestConsultForm title={item.title} program_id={item.id} />
      </div>{:else}{/if}
  </div>
</div>

<style>
  /* Using font-sans from Tailwind's default config as Exo and Roboto are not explicitly set up */
  /* If Exo is critical, it should be added to tailwind.config.js and app.html or global CSS */

  /* Similarly for Roboto if needed, but the screenshot seems to use Exo mostly */
</style>
