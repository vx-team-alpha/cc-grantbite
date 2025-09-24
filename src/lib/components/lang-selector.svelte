<script lang="ts">
  import { onMount } from "svelte"
  import {
    locales as availableLocales,
    getLocale,
    setLocale,
  } from "$lib/paraglide/runtime.js"
  import { browser } from "$app/environment"

  type Locale = (typeof availableLocales)[number]

  interface Language {
    code: Locale
    name: string
    icon: string
    emojiIcon: string
  }

  const LANGUAGES: Language[] = [
    { code: "en", name: "English", icon: "us", emojiIcon: "🇺🇸" },
    { code: "de", name: "Deutsch", icon: "de", emojiIcon: "🇩🇪" },
    { code: "es", name: "Español", icon: "es", emojiIcon: "🇪🇸" },
    { code: "fr", name: "Français", icon: "fr", emojiIcon: "🇫🇷" },
    { code: "pt", name: "Português", icon: "pt", emojiIcon: "🇵🇹" },
  ]

  let openLang = false
  let currentLocaleCode = getLocale()
  let selected: Language =
    LANGUAGES.find((lang) => lang.code === currentLocaleCode) || LANGUAGES[0]
  let langRef: HTMLDivElement

  function toggleLang() {
    openLang = !openLang
  }

  function selectLang(lang: Language) {
    selected = lang
    openLang = false
    setLocale(lang.code, { reload: true }) // Set the locale without a full page reload
  }

  function handleClickOutside(event: MouseEvent) {
    if (langRef && !langRef.contains(event.target as Node)) {
      openLang = false
    }
  }

  onMount(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  })
</script>

<!-- Language Selector -->
<div class="relative" bind:this={langRef}>
  <button
    on:click={toggleLang}
    class="flex items-center text-sm font-medium text-black gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
  >
    <div class="flex items-center gap-2">
      {#if browser}
        <img
          src={`/images/${selected.icon}.svg`}
          alt={selected.code}
          class="flag"
        />
      {/if}
      <!-- <span class="w-5 h-4">{selected.emojiIcon}</span> -->
      <span class="uppercase">{selected.code}</span>
    </div>
    <span class="pb-1">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  </button>

  {#if openLang}
    <div class="absolute mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
      {#each LANGUAGES as lang (lang.code)}
        <button
          on:click={() => selectLang(lang)}
          class="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
        >
          <img
            src={`/images/${lang.icon}.svg`}
            alt={lang.code}
            class="w-5 h-4 mr-2"
          />
          <!-- <span class="w-5 h-4 mr-2">{lang.emojiIcon}</span> -->
          <span>
            {lang.name}
          </span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .flag {
    width: 1.25rem;
    height: 0.75rem;
    object-fit: cover;
    border-radius: 0.125rem;
  }
</style>
