<script lang="ts">
  import SearchResultCard from "../components/SearchResultCard.svelte"
  import type { FundingProgramWithTranslation } from "../db_translation_helper"
  import { m } from "../paraglide/messages"

  type ChatFundingResults = Pick<
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
  >[]

  let { Results }: { Results: ChatFundingResults } = $props()
</script>

<div class="w-full mx-auto">
  <div
    class="flex gap-4 font-medium text-sm leading-3.5 border-b border-brand-primary/50 pb-3"
  >
    <p class="">{m.funding_oppotunities()}</p>
    <p class="font-bold text-brand-blue">{Results.length} {m.results()}</p>
  </div>
  <div
    class="overflow-y-auto flex flex-col items-center h-full"
    style="max-height: calc(100vh - 200px); "
  >
    {#if Results.length === 0}
      <div
        class="flex flex-col items-center justify-center h-full gap-4 max-w-md text-center"
      >
        <!-- <img
          src="/images/monkey_not_found.svg"
          alt="monkey_not_found "
          class="size-28"
        /> -->
        <p class="text-lg font-medium text-pretty text-gray-400">
          {m.chat_no_results_found()}
        </p>
      </div>
    {/if}
    {#each Results as result}
      <SearchResultCard item={result} isChat={true} />
    {/each}
  </div>
</div>
