<script lang="ts" module>
  export interface TagButtonProps {
    icon: unknown
    text: string
    IconBackground?: string
    onClick?: () => void
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation"
  import { m } from "$lib/paraglide/messages"
  import { localizeHref } from "$lib/paraglide/runtime"
  import { useTextAnimation } from "$src/lib/hooks/use-text-animation"
  import BarChart from "$src/lib/svg/bar-chart.svelte"
  import SearchWithText from "$src/lib/svg/search-with-text.svelte"
  import Lamp from "$src/lib/svg/lamp.svelte"
  import ReverveArrows from "$src/lib/svg/reverve-arrows.svelte"
  import DotsConnect from "$src/lib/svg/dots-connect.svelte"
  import Button from "../../ui/button/button.svelte"
  import { IsMobile } from "$src/lib/hooks/is-mobile.svelte"

  // local value to bind input
  let query = ""

  const handleSearch = () => {
    // go /funding with query
    if (query.trim()) {
      goto(localizeHref(`/funding?q=${encodeURIComponent(query.trim())}`))
    } else {
      return
    }
  }

  const handleTagClick = (tag: string) => {
    goto(localizeHref(`/funding?q=${encodeURIComponent(tag.trim())}`))
  }

  const placeholders = [
    m.hero_program_1(),
    m.hero_program_2(),
    m.hero_program_3(),
    m.hero_program_4(),
  ]

  const getIsMobile = new IsMobile()
  let isMobile = $derived(getIsMobile.current)

  const { currentText } = useTextAnimation(placeholders, 2000)

  // Create a reactive placeholder that updates based on mobile state and current text
  let placeholder = $derived(
    isMobile
      ? $currentText
      : `${m.searchbar_placeholder_text()}: ${$currentText}`,
  )
</script>

<!-- Main HeroSection markup -->
<div class="relative z-10">
  <div class="relative overflow-hidden">
    <!-- Background Image with Tropical Leaves -->
    <div
      class="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat -top-1"
      style="background-image: url('/images/hero-bg.jpg')"
    ></div>

    <!-- Content Overlay -->
    <div class="relative z-10 flex flex-col items-center justify-center py-20">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Main Heading -->
        <h1
          class="main-headline text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
        >
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {m.start_main_headline()}
          <br />
          {m.start_main_headline_after_break()}
          <span style="color: #f59e0b;"
            >{m.start_main_headline_highlight()}</span
          >
        </h1>

        <!-- Subheading -->
        <p class="text-lg md:text-xl text-gray-700 mb-12 font-medium">
          {m.start_sub_heading()}
        </p>
      </div>
    </div>
  </div>

  <div class="app-container">
    <!-- Search Section -->
    <div class="max-w-5xl w-full mx-auto -mt-7 sm:-mt-10 z-10 relative">
      <div class="relative flex items-center rounded-2xl h-12 sm:h-[82px]">
        <!-- Icon -->

        <img
          src="/images/monkey_search.svg"
          alt="Search"
          class="absolute top-1/2 transform -translate-y-1/2 left-3 md:left-5 size-8 sm:size-[50px]"
        />

        <!-- Search Input -->
        <input
          type="search"
          name="q"
          bind:value={query}
          {placeholder}
          class="w-full h-full bg-white px-12 xs:px-14 md:px-20 text-base font-medium font-exo rounded-md sm:rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rin border-2 sm:border-[3px] border-brand-primary"
          onkeypress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          type="submit"
          size="icon"
          class="group absolute sm:right-[9px] right-1.5 top-1/2 transform -translate-y-1/2 size-8 sm:size-16 rounded-sm sm:rounded-[10px] flex items-center justify-center "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="white"
            class="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            ></path>
          </svg>
        </Button>
      </div>
    </div>

    <!-- Tag Buttons -->
    <div
      class="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto mt-12 sm:mt-12"
    >
      <button
        onclick={() => handleTagClick(m.hero_program_1())}
        class="md:max-w-xs w-full p-1 flex items-center gap-3 text-body4 rounded-lg border-gray-200 bg-white text-gray-800 text-sm font-medium transition-all cursor-pointer border-2 hover:border-brand-primary"
      >
        <BarChart />

        {m.hero_program_1()}
      </button>

      <button
        onclick={() => handleTagClick(m.hero_program_2())}
        class="md:max-w-xs w-full p-1 flex items-center gap-3 text-body4 rounded-lg border-gray-200 bg-white text-gray-800 text-sm font-medium transition-all cursor-pointer border-2 hover:border-brand-primary"
      >
        <SearchWithText />

        {m.hero_program_2()}
      </button>

      <button
        onclick={() => handleTagClick(m.hero_program_3())}
        class="md:max-w-xs w-full p-1 flex items-center gap-3 text-body4 rounded-lg border-gray-200 bg-white text-gray-800 text-sm font-medium transition-all cursor-pointer border-2 hover:border-brand-primary"
      >
        <Lamp />

        {m.hero_program_3()}
      </button>

      <button
        onclick={() => handleTagClick(m.hero_program_4())}
        class="md:max-w-xs w-full p-1 flex items-center gap-3 text-body4 rounded-lg border-gray-200 bg-white text-gray-800 text-sm font-medium transition-all cursor-pointer border-2 hover:border-brand-primary"
      >
        <ReverveArrows />

        {m.hero_program_4()}
      </button>

      <button
        onclick={() => handleTagClick(m.hero_program_5())}
        class="w-full md:max-w-sm p-1 flex items-center gap-3 text-body4 rounded-lg border-gray-200 bg-white text-gray-800 text-sm font-medium transition-all cursor-pointer border-2 hover:border-brand-primary"
      >
        <DotsConnect />

        {m.hero_program_5()}
      </button>
    </div>
  </div>
</div>
