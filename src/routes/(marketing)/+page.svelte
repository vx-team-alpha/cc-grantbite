<script>
  import FinderSection from "$lib/components/sections/home-page/finder-section.svelte"
  import NewsletterSection from "$lib/components/sections/home-page/newletter-section.svelte"
  import FundingSection from "$lib/components/sections/home-page/funding-section.svelte"
  import HeroSection from "$lib/components/sections/home-page/hero-section.svelte"
  import StatsSection from "$lib/components/sections/home-page/stats-section.svelte"
  import { WebsiteName, WebsiteBaseUrl } from "../../config" // Use WebsiteName from config
  import { m } from "$lib/paraglide/messages"
  import { page } from "$app/state"
  import FaqSection from "$lib/components/sections/home-page/faq-section.svelte"

  const currentUrl = $derived(page.url.href)
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: WebsiteName,
    url: WebsiteBaseUrl,
  }
  const jsonldScript = `<script type="application/ld+json">${
    JSON.stringify(ldJson) + "<"
  }/script>`
</script>

<svelte:head>
  <title>{m.main_title()}</title>
  <meta name="description" content={m.main_description()} />
  <link rel="canonical" href={currentUrl} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonldScript}
</svelte:head>

<div class="relative space-y-12 z-10">
  <div
    class="absolute inset-0 -z-10 grid grid-cols-3 filter blur-3xl w-full overflow-hidden top-96 pointer-none"
  >
    <div
      class="bg-[#AAE500]/6 w-[130%] h-[90%] col-start-3"
      style="clip-path: ellipse(50% 50% at 50% 50%);"
    ></div>
  </div>
  <HeroSection />
  <StatsSection />
  <FundingSection />
</div>
<div class="relative z-10 py-20">
  <NewsletterSection />
  <FinderSection />

  <div
    class="absolute inset-0 -z-10 grid grid-cols-3 filter blur-3xl w-full overflow-hidden pointer-none:"
  >
    <div
      class="bg-[#AAE500]/8 w-[130%] h-[90%] mt-auto"
      style="clip-path: ellipse(50% 50% at 50% 50%);"
    ></div>
    <div
      class="bg-[#FFAED5]/8 w-[130%] h-[90%]"
      style="clip-path: ellipse(50% 50% at 50% 50%);"
    ></div>
    <div
      class="bg-[#3D67FF]/8 w-[130%] h-[90%] mt-10"
      style="clip-path: ellipse(50% 50% at 50% 50%);"
    ></div>
  </div>
</div>
<div class="relative z-10 pb-20">
  <FaqSection />
</div>
