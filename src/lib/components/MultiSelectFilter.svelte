<script lang="ts">
  import { onMount } from "svelte"
  import { ChevronDown, X, Check } from "lucide-svelte"
  import { cn } from "../utils"

  export let filterLabel: string
  export let filterOptions: { value: string; label: string }[] = []
  export let filterValues: string[] = []
  export let isDropdownOpen = false
  export let maxOptionsDisplayed = 3
  export let disabled = false
  export let placeholder = ""

  // Custom classes
  export let buttonClass = ""
  export let dropdownClass = ""
  export let optionClass = ""

  // Callback function for value changes (replaces createEventDispatcher)
  export let onChange: ((values: string[]) => void) | undefined = undefined

  let dropdownElement: HTMLDivElement
  let buttonElement: HTMLButtonElement

  function handleSelect(optionValue: string) {
    if (filterValues.includes(optionValue)) {
      filterValues = filterValues.filter((v) => v !== optionValue)
    } else {
      filterValues = [...filterValues, optionValue]
    }
    onChange?.(filterValues)
  }

  function toggleDropdown() {
    if (disabled) return
    isDropdownOpen = !isDropdownOpen
  }

  function closeDropdown() {
    isDropdownOpen = false
  }

  function clearSelection(event?: Event) {
    event?.stopPropagation()
    filterValues = []
    onChange?.(filterValues)
  }

  function handleClickOutside(event: MouseEvent) {
    if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
      closeDropdown()
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (disabled) return

    switch (event.key) {
      case "Escape":
        closeDropdown()
        buttonElement?.focus()
        break
    }
  }

  function handleOptionKeydown(event: KeyboardEvent, optionValue: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleSelect(optionValue)
    }
  }

  // Reactive statements
  $: selectedOptions = filterOptions.filter((o) =>
    filterValues.includes(o.value),
  )

  $: displayText = (() => {
    if (selectedOptions.length === 0) {
      return placeholder || filterLabel
    }

    if (selectedOptions.length > maxOptionsDisplayed) {
      const visibleLabels = selectedOptions
        .slice(0, maxOptionsDisplayed)
        .map((o) => o.label)
        .join(", ")
      return `${visibleLabels} +${selectedOptions.length - maxOptionsDisplayed}`
    }

    return selectedOptions.map((o) => o.label).join(", ")
  })()

  // Generate unique ID for accessibility
  const dropdownId = `multi-dropdown-${Math.random().toString(36).substr(2, 9)}`

  onMount(() => {
    document.addEventListener("click", handleClickOutside)
    document.addEventListener("keydown", handleKeydown)

    return () => {
      document.removeEventListener("click", handleClickOutside)
      document.removeEventListener("keydown", handleKeydown)
    }
  })
</script>

<div class="relative w-full" bind:this={dropdownElement}>
  <button
    bind:this={buttonElement}
    type="button"
    class={`border-input bg-background ring-offset-background placeholder:text-brand-light-gray focus-visible:ring-ring flex justify-between h-12 w-full rounded-xl border items-center border-brand-light-gray px-7 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors
      ${buttonClass}`}
    {disabled}
    on:click={toggleDropdown}
    on:keydown={handleKeydown}
    aria-haspopup="listbox"
    aria-expanded={isDropdownOpen}
    aria-controls={dropdownId}
    aria-label={`${filterLabel} multiselect. ${selectedOptions.length} items selected`}
  >
    <span
      class={cn(
        "truncate text-left ",
        selectedOptions.length === 0 && "text-brand-light-gray",
      )}
    >
      {displayText}
    </span>
    <div class="flex items-center flex-shrink-0">
      {#if filterValues.length > 0 && !disabled}
        <span
          role="button"
          tabindex="0"
          class="p-1 ml-1 text-gray-400 hover:text-gray-600 focus:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300 rounded transition-colors"
          on:click={clearSelection}
          on:keydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              clearSelection(e)
            }
          }}
          aria-label="Clear selection"
        >
          <X class="w-3 h-3" />
        </span>
      {/if}
      <ChevronDown
        class={`w-4 h-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""} ${disabled ? "opacity-50" : ""}`}
      />
    </div>
  </button>

  {#if isDropdownOpen && !disabled}
    <div
      id={dropdownId}
      class={`absolute z-50 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-auto bg-white border border-gray-300 ${dropdownClass}`}
      role="listbox"
      aria-multiselectable="true"
      aria-label={`${filterLabel} options`}
    >
      {#if filterOptions.length === 0}
        <div class="px-4 py-2 text-sm text-gray-500">No options available</div>
      {:else}
        <ul class="py-1">
          {#each filterOptions as option (option.value)}
            <li
              class={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                ${filterValues.includes(option.value) ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-700"}
                ${optionClass}`}
              role="option"
              aria-selected={filterValues.includes(option.value)}
              tabindex="0"
              on:click={() => handleSelect(option.value)}
              on:keydown={(e) => handleOptionKeydown(e, option.value)}
            >
              <div class="flex items-center">
                <span class="flex-grow mr-2">{option.label}</span>
                {#if filterValues.includes(option.value)}
                  <Check
                    class="w-4 h-4 text-teal-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                {/if}
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>
