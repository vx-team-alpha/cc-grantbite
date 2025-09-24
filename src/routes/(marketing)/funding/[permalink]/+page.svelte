<script lang="ts">
  import { page } from "$app/state"
  import type { PageData } from "./$types"
  import MarkdownAccordion from "$lib/components/markdown-accordion-test.svelte"
  import FinancialInstrumentType from "$lib/components/FinancialInstrumentType.svelte"
  import { type Message } from "@ai-sdk/svelte"

  import { getLocale, localizeHref } from "$lib/paraglide/runtime"
  import FundingOverview from "$lib/components/sections/detail-page/funding-overview.svelte"
  import FundingProvider from "$lib/components/sections/detail-page/funding-provider.svelte"
  import TableContent from "$lib/components/sections/detail-page/table-content.svelte"

  import TranslationWarningBanner from "$lib/components/TranslationWarningBanner.svelte"

  import * as enums from "$lib/data_values/enums"
  import { m } from "$lib/paraglide/messages"
  import { onMount } from "svelte"
  import { translators } from "$src/lib/translators"
  import type { FundingContact } from "$src/lib/db_translation_helper"
  import RequestConsultForm from "$src/lib/components/forms/request-consult-form.svelte"
  import SimilarProgram from "$src/lib/components/sections/detail-page/similar-program.svelte"
  import { chatIdGenerator } from "$src/lib/ai-related/chat"
  import RightsideWidgetWrapper from "$src/lib/components/sections/detail-page/rightside-widget-wrapper.svelte"

  import FundingBookmark from "$src/lib/components/funding-bookmark.svelte"
  import NewDetailsChatBtn from "$src/lib/chat/program-detail-chat-btn.svelte"
  import Button from "$src/lib/components/ui/button/button.svelte"
  import FundingSearchBackBtn from "$src/lib/components/funding-search-back-btn.svelte"

  let { data }: { data: PageData } = $props()
  const currentUrl = $derived(page.url.href)

  // Type assertion for program data
  const {
    program,
    meta,
    lastUpdated,
    availableLanguageCombinations,
    similar_programs,
  } = data
  const similarProgramsProcessed = $derived(
    similar_programs.map(({ title, permalink }) => ({
      label: title,
      link: localizeHref(`/funding/${permalink}`),
    })),
  )
  const otherLanguages = availableLanguageCombinations.filter(
    (t) => t.language != data.currentLanguage,
  )
  const formatedLastUpdate = new Date(lastUpdated).toLocaleDateString("de-DE")

  let showInteractive = $state(false)
  onMount(() => {
    showInteractive = true
  })

  const contact = program.contact as FundingContact
  const ld_json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        url: page.url.href,
        name: program.seo_title || meta.title,
        description: program.seo_meta_description || meta.description,
        isPartOf: {
          "@type": "WebSite",
          url: new URL(localizeHref("/"), page.url),
          name: "FundingFinder.",
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "FundingFinder.",
              item: new URL(localizeHref("/"), page.url),
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "FundingFinder. Search",
              item: new URL(localizeHref("/funding"), page.url),
            },
            {
              "@type": "ListItem",
              position: 3,
              name: program.seo_title,
              item: page.url.href,
            },
          ],
        },
        mainEntity: {
          "@id": "#governmentService",
        },
        inLanguage: getLocale(),
      },
      {
        "@type": "GovernmentService",
        "@id": "#governmentService",
        name: program.seo_title,
        alternateName: program.title,
        serviceType: translators.translateFinancialInstrumentType(
          program.overview_financial_instrument as enums.FinancialInstrumentType,
        ),
        description: program.seo_meta_description,
        url: page.url.href,
        provider: [
          {
            "@id": "#fnd",
          },
        ],
        areaServed: {
          "@type": "AdministrativeArea",
          name: program.overview_region,
        },
        audience: {
          "@type": "Audience",
          audienceType: program.overview_eligible_applicants_short
            .map((a) =>
              translators.translateEligibleApplicantsShort(
                a as enums.EligibleApplicantsShort,
              ),
            )
            .join(", "),
          description: program.overview_eligible_applicants_long,
          geographicArea: {
            "@type": "AdministrativeArea",
            name: program.overview_region,
          },
        },
        offers: {
          "@type": "Offer",
          name: translators.translateFinancialInstrumentType(
            program.overview_financial_instrument as enums.FinancialInstrumentType,
          ),
          description: program.overview_maximum_funding_amount,
          itemOffered: { "@id": "#governmentService" },
        },
      },

      {
        "@type": "GovernmentOrganization",
        "@id": "#fnd",
        name: program.provider_funding_body,
        url: contact?.website?.url,
      },
    ],
    // "@type": "Grant",
    // name: program.title,
    // description: program.introduction_short,
    // url: page.url.href, // Page URL
    // sponsor: {
    //   "@type": "Organization",
    //   name: program.provider_funding_body || "Unknown Provider",
    // },
    // amount: {
    //   // Using totalPaymentDue as a proxy for amount if applicable
    //   "@type": "MonetaryAmount",
    //   value:
    //     parseFloat(
    //       program.overview_maximum_funding_amount
    //         ?.replace(/[^0-9.,]/g, "")
    //         .replace(",", "."),
    //     ) || null,
    //   currency: program.overview_maximum_funding_amount?.includes("€")
    //     ? "EUR"
    //     : program.overview_maximum_funding_amount?.includes("$")
    //       ? "USD"
    //       : "EUR",
    // },
    // spatialCoverage: {
    //   "@type": "AdministrativeArea",
    //   name: program.overview_region,
    // },
    // category: program.overview_eligible_sectors_short.map((s) =>
    //   translators.translateEligibleSectorsShort(
    //     s as enums.EligibleSectorsShort,
    //   ),
    // ),
    // applicationDeadline:
    //   program.overview_deadline || program.overview_open_until,
    // audience: program.overview_beneficiary, // Beneficiary
    // award: translators.translateProgramLevel(
    //   program.provider_program_level as enums.ProgramLevel,
    // ), // Program Level
  })

  // eslint-disable-next-line no-useless-escape
  const ld_json_html = `<script type="application/ld+json"> ${ld_json} <\/script>`
  const initialMessages: Message[] = [
    {
      id: chatIdGenerator(),
      content: `The user requested assistance to the funding with the permalink: "${data.program.permalink}"`,
      role: "system",
    },
    {
      id: chatIdGenerator(),
      content: m.details_initial_chat_message({ program_title: program.title }),
      role: "assistant",
    },
  ]
</script>

<svelte:head>
  <title>{program.seo_title || meta.title}</title>
  <meta
    name="description"
    content={program.seo_meta_description || meta.description}
  />
  <link rel="canonical" href={currentUrl} />
  {#each otherLanguages as alternativeLanguage}
    <link
      rel="alterate"
      hreflang={alternativeLanguage.language}
      href={localizeHref(`/funding/${alternativeLanguage.permalink}`, {
        locale: alternativeLanguage.language,
      })}
    />
  {/each}

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content={page.url.href} />
  <meta property="og:title" content={program.seo_title || meta.title} />
  <meta
    property="og:description"
    content={program.seo_meta_description || meta.description}
  />
  <meta property="og:image" content={new URL("/favicon.svg", page.url).href} />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content={page.url.href} />
  <meta name="twitter:title" content={program.seo_title || meta.title} />
  <meta
    name="twitter:description"
    content={program.seo_meta_description || meta.description}
  />

  <!-- Keywords -->
  {#if program.seo_keywords && program.seo_keywords.length > 0}
    <meta name="keywords" content={program.seo_keywords.join(", ")} />
  {/if}
  {#if program}
    <!-- prettier-ignore -->
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html ld_json_html}
  {/if}
</svelte:head>

<div class="bg-white">
  <main class="relative md:static app-container py-8">
    <!-- Back to search -->
    <div class="mb-10 mt-4 sm:mt-8">
      <FundingSearchBackBtn />
      <!-- Adjusted top margin from 168px (top of Frame 67) - 118px (top of Rectangle 6) = 50px. Using relative values. -->

      <!-- <div class="xl:hidden">
        <FundingBookmark
          actionPath="/account/api?/bookmark"
          id={program.id}
          isChecked={program.bookmarked}
        />
      </div> -->
    </div>

    <!-- Header Section -->
    <section
      class="md:relative flex lg:grid grid-cols-12 justify-between mb-10 gap-x-2 lg:gap-x-8"
    >
      <div class=" lg:col-span-8">
        <div class="flex justify-start">
          <h1
            class="max-md:pr-18 mb-2 text-2xl sm:text-3xl md:text-[30px] font-bold text-[#1E1E1E] leading-relaxed"
          >
            {program?.title || "Loading..."}

            <!-- {#if program.program_status}
            <span class="align-middle inline-block">
              <ProgramStatus
              status={program.program_status as enums.ProgramStatus}
              />
              </span>
              {/if} -->
            <FundingBookmark
              size="sm"
              actionPath="/account/api?/bookmark"
              id={program.id}
              isChecked={program.bookmarked}
              class="inline-flex [&_button]:!p-0 [&_button]:h-[2.9rem] sm:[&_button]:h-[3.8rem] md:[&_button]:h-[3.8rem]  ml-2 absolute "
            />
          </h1>
          <!-- <div class="align-middle inline-block ml-auto"></div> -->
        </div>
        <div class="flex gap-2 text-brand-light-gray mb-4 md:mb-8">
          {m.details_funding_last_updated()}: {formatedLastUpdate}
        </div>

        <!-- Category Tags -->
        <div class="flex space-x-2 mb-4">
          <div class="flex gap-2">
            {#if program.overview_financial_instrument}
              <FinancialInstrumentType
                type={program.overview_financial_instrument as enums.FinancialInstrumentType}
              />
            {/if}
          </div>
        </div>
      </div>

      <div class="absolute top-10 right-4">
        <NewDetailsChatBtn {initialMessages} />
      </div>
      <!-- <div class="lg:flex gap-3 lg:col-span-4">
        <div class="!px-10">
          <FundingBookmark
            size="lg"
            actionPath="/account/api?/bookmark"
            id={program.id}
            isChecked={program.bookmarked}
          /> 
        </div>
      </div> -->
    </section>

    <!-- Translation Warning Banner -->
    <TranslationWarningBanner
      isUsingFallback={data.isUsingFallback}
      fallbackLanguage={data.fallbackLanguage}
      currentLanguage={data.currentLanguage}
    />

    <!-- Main Content Grid -->
    <div
      class="flex flex-col-reverse xl:grid xl:grid-cols-12 gap-x-8 gap-y-4 xl:gap-y-12"
    >
      <div class="lg:col-span-8">
        <!-- Short Summary -->
        <section class="mb-12">
          <p
            class="text-base font-medium leading-[34px] text-black max-w-[817px]"
          >
            {program.introduction_short || "No summary available."}
          </p>
        </section>
        <!-- Left Column: Table of content -->
        <TableContent tocItems={data.markdownContent.tocItems} />

        <!-- Left Column: Markdown Content -->
        {#if program.md_content}
          <!-- <MarkdownAccordion markdownContent={data.markdownContent} /> -->
          {#if showInteractive}
            <MarkdownAccordion markdownContent={data.markdownContent} />
          {:else}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html data.markdownPrerendered}
          {/if}
        {:else}
          <p>{m.details_funding_no_detailed_info_available()}</p>
        {/if}

        <SimilarProgram similarPrograms={similarProgramsProcessed} />

        <!-- Tags -->
        <div class="flex flex-wrap gap-x-3.5 gap-y-2.5 mt-10">
          {#if program.seo_keywords && program.seo_keywords.length > 0}
            {#each program.seo_keywords as item}
              <span
                class="px-3 py-2 bg-brand-primary text-white rounded-sm text-xs font-semibold"
                >#{item}</span
              >
            {/each}
          {/if}
        </div>
      </div>

      <!-- Right Column: Sidebar -->
      <div class="flex flex-col lg:block gap-3 lg:col-span-4 space-y-8">
        <!-- Funding Overview Box -->
        <RightsideWidgetWrapper
          headline={m.details_funding_overview()}
          headerClass="bg-[#029ECF]"
          contentClass="bg-[#EFFBFF] "
        >
          <FundingOverview {data} />
        </RightsideWidgetWrapper>
        <!-- Funding Provider Box -->
        <RightsideWidgetWrapper
          headline={m.details_funding_provider()}
          headerClass="bg-[#4FA530]"
          contentClass="bg-[#F3FFEF] "
        >
          <FundingProvider {data} />
        </RightsideWidgetWrapper>

        <!-- Contact Us Button -->
        <RequestConsultForm
          btxTxt={m.details_funding_contact_us()}
          varient="primary"
          title={data.program.title}
          program_id={data.program.id}
        />
      </div>
    </div>
  </main>
</div>

<!-- <DetailsChat {initialMessages} /> -->
