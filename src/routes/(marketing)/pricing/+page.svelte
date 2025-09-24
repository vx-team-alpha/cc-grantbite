<script lang="ts">
  import PricingCard from "$src/lib/components/cards/pricing-card.svelte"
  import TestimonialCard from "$src/lib/components/cards/testimonial-card.svelte"
  import Switch from "$src/lib/components/ui/switch/switch.svelte"

  import * as Accordion from "$lib/components/ui/accordion/index.js"
  import FaqSection from "$src/lib/components/sections/home-page/faq-section.svelte"

  const pricing = [
    {
      title: "starter",
      price: "free",
      description: "Best for occasional users and basic searches",
      trialInfo: "14-days free trial",
      features: [
        "Access to public funding database",
        "Basic search & filters",
        "Up to 5 funding views per month",
        "Email support",
      ],
      buttonText: "try it for free",
    },
    {
      title: "Pro",
      price: "$29/mo",
      description: "For startups and growing teams needing deeper insights.",
      trialInfo: "14-days free trial",
      features: [
        "Unlimited funding searches",
        "Private company data access",
        "Advanced filters & sorting",
        "Saved searches & alerts",
        "Priority support",
      ],
      buttonText: "try it for free",
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "Tailored access for large teams and organizations.",
      trialInfo: "14-days free trial",
      features: [
        "Full access to all datasets",
        "Custom integrations (CRM, BI tools)",
        "Dedicated account manager",
        "Team collaboration features",
        "Data export & API access",
      ],
      buttonText: "try it for free",
    },
  ]
  const Faqs = [
    "What is Funding Finder?",
    "Is it free to use?",
    "How does the matching system work?",
    "How often is the database updated?",
    "Who can use Funding Finder?",
    "What types of funding do you list?",
  ]
</script>

<div class="p-3 my-11 space-y-14 flex flex-col items-center">
  <div class="w-full max-w-[700px] text-center space-y-3">
    <h1 class="font-bold text-center text-2xl sm:text-5xl leading-14">
      Simple, Transparent Pricing
    </h1>
    <p class="font-medium text-base sm:text-2xl leading-8">
      Start free, upgrade when you're ready. No hidden fees—just actionable
      data.
    </p>
  </div>
  <div class="flex items-center gap-5">
    <p class="text-sm sm:text-base leading-8 font-medium">Monthly</p>
    <Switch />
    <p>Annually <span class="text-teal-gradient">(discount up to 25%)</span></p>
  </div>
  <div class="grid lg:grid-cols-3 gap-8">
    {#each pricing as pricing}
      <PricingCard
        buttonText={pricing.buttonText}
        description={pricing.description}
        features={pricing.features}
        title={pricing.title}
        price={pricing.price}
        trialInfo={pricing.trialInfo}
      />
    {/each}
  </div>
  <p class="font-bold text-center text-2xl sm:text-5xl leading-14 mt-14">
    Trusted by over <b>100,000</b> sales teams around the world
  </p>
  <div class="grid lg:grid-cols-3 gap-8">
    {#each [1, 2, 3] as li, index}
      <TestimonialCard />
    {/each}
  </div>
  <div class="relative z-10 pb-20 w-full">
    <FaqSection />
  </div>
</div>
