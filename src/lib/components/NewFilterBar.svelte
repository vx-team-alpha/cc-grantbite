<script lang="ts">
  import { filters } from "$lib/data_values/filters"
  import ArrowDownIcon from "$lib/svg/arrow-down-icon.svelte"
  import { X, ListFilter as ListFilterIcon } from "lucide-svelte"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "$lib/components/ui/popover"
  import {
    Drawer,
    DrawerContent,
    DrawerHeader,
  } from "$lib/components/ui/drawer"
  import FilterCommandBox from "./FilterCommandBox.svelte"
  import { m } from "../paraglide/messages"

  // Props
  let { activeFilters = {}, onChange = () => {} } = $props<{
    activeFilters?: Record<string, string | string[]>
    onChange?: (filters: Record<string, string | string[]>) => void
  }>()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let currentFilterId = $state("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let currentFilterLabel = $state("")
  let isDrawerOpen = $state(false)
  const popoverTriggerHandler = (filter: { id: string; label: string }) => {
    currentFilterId = filter.id
    currentFilterLabel = filter.label
  }
  function handleFilterChange(
    filterId: string,
    value: string | null | string[],
  ) {
    if (value === null || (Array.isArray(value) && value.length === 0)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [filterId]: removed, ...rest } = activeFilters
      activeFilters = rest
    } else {
      activeFilters = { ...activeFilters, [filterId]: value }
    }
    onChange(activeFilters)
  }

  function clearAllFilters() {
    activeFilters = {}
    onChange(activeFilters)
  }

  const activeFilterCount = $derived(Object.keys(activeFilters).length)

  const removeTag = (filterId: string, index: number) => {
    const currentValues = getActiveValues(filterId)
    const newValues = currentValues.filter((_, i) => i !== index)
    handleFilterChange(filterId, newValues)
  }

  const getActiveValues = (filterId: string) => {
    const arr = Array.isArray(activeFilters[filterId])
      ? (activeFilters[filterId] as string[])
      : []
    return arr
  }
  const getOptions = (
    type: "all" | "selected" | "unselected" = "unselected",
    filterId: string,
    options: { value: string; label: string }[],
  ) => {
    const activeValues = getActiveValues(filterId)
    if (type === "all") {
      return options
    }
    if (type === "selected") {
      return options.filter((option) => activeValues.includes(option.value))
    }
    // Default to unselected
    return options.filter((option) => !activeValues.includes(option.value))
  }

  const toggleDrawer = () => {
    isDrawerOpen = !isDrawerOpen
  }
</script>

<div class="relative">
  <div class="flex justify-between items-center lg:hidden">
    {#if activeFilterCount > 0}
      <button
        type="button"
        class="text-teal-100 hover:text-white text-sm font-medium flex items-center cursor-pointer"
        onclick={clearAllFilters}
      >
        {m.clear_all_filters()} ({activeFilterCount})
      </button>
    {/if}
    <button
      class="bg-brand-dark-orange ms-auto flex cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white shadow"
      onclick={toggleDrawer}
    >
      <ListFilterIcon size={16} />
      Filters
      {#if activeFilterCount > 0}
        <span class="ml-1">({activeFilterCount})</span>
      {/if}
    </button>
  </div>

  <div
    class="hidden w-fit max-w-7xl flex-wrap gap-2.5 rounded-md bg-white/15 px-5 py-4 lg:flex"
  >
    {#each filters as filter (filter.id)}
      <Popover>
        <PopoverTrigger
          class="text-brand-gray flex h-auto cursor-pointer items-center justify-between space-x-5 rounded-sm bg-white px-3 py-2 text-sm font-medium"
          onclick={() => popoverTriggerHandler(filter)}
        >
          <div class="flex items-center flex-wrap gap-2 --max-w-56">
            {filter.label}
            {#each getOptions("selected", filter.id, filter.options) as filterObj, index (filterObj.value)}
              <div
                class="bg-brand-blue/10 text-brand-blue ms-1 flex items-center justify-between space-x-2 rounded-sm px-2 py-1 text-sm font-semibold border-dashed border-red-500"
              >
                <span>{filterObj.label}</span>
                <span
                  role="button"
                  tabindex="0"
                  class="cursor-pointer p-1 hover:bg-gray-300"
                  onclick={(e) => {
                    // prevent the parent click
                    e.preventDefault()
                    e.stopPropagation()
                    removeTag(filter.id, index)
                  }}
                  onkeydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      removeTag(filter.id, index)
                    }
                  }}
                  aria-label="Remove tag"
                >
                  <X size={14} />
                </span>
              </div>
            {/each}
          </div>
          <ArrowDownIcon className="ml-2 inline-block" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          class="min-w-sm space-y-2.5 rounded-xl bg-white p-4"
          side="bottom"
          avoidCollisions={false}
        >
          <FilterCommandBox
            label={filter.label}
            options={getOptions("unselected", filter.id, filter.options)}
            value={getActiveValues(filter.id)}
            onChange={(selected) => handleFilterChange(filter.id, selected)}
          />
        </PopoverContent>
      </Popover>
    {/each}
    {#if activeFilterCount > 0}
      <button
        type="button"
        class="text-teal-100 hover:text-white text-sm font-medium flex items-center cursor-pointer"
        onclick={clearAllFilters}
      >
        Clear all filters ({activeFilterCount})
      </button>
    {/if}
  </div>

  <!-- Mobile Drawer -->
  <Drawer
    open={isDrawerOpen}
    onOpenChange={(open: boolean) => (isDrawerOpen = open)}
  >
    <DrawerContent class="max-h-[80vh] bg-white">
      <DrawerHeader class="text-left">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Filters</h2>
          <button onclick={() => (isDrawerOpen = false)}>
            <X size={20} />
          </button>
        </div>
      </DrawerHeader>
      <div class="space-y-4 p-4">
        {#each filters as filter (filter.id)}
          <Popover>
            <PopoverTrigger
              onclick={() => {
                currentFilterId = filter.id
                currentFilterLabel = filter.label
              }}
              class="border w-full text-brand-gray flex h-auto cursor-pointer items-center justify-between space-x-5 rounded-sm bg-white px-3 py-2.5 text-sm font-medium"
            >
              <div class="flex items-center gap-2 flex-wrap">
                {filter.label}
                {#each getOptions("selected", filter.id, filter.options) as filterObj, index (filterObj.value)}
                  <div
                    class="bg-brand-blue/10 text-brand-blue ms-1 flex items-center justify-between space-x-2 rounded-sm px-2 py-1 text-sm font-bold"
                  >
                    <span>{filterObj.label}</span>
                    <span
                      role="button"
                      tabindex="0"
                      class="cursor-pointer"
                      onclick={() => removeTag(filter.id, index)}
                      onkeydown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          removeTag(filter.id, index)
                        }
                      }}
                      aria-label="Remove tag"
                    >
                      <X size={14} />
                    </span>
                  </div>
                {/each}
              </div>
              <ArrowDownIcon className="ml-2 inline-block" />
            </PopoverTrigger>
            <PopoverContent
              class="min-w-sm space-y-2.5 rounded-xl bg-white p-4 border-0 shadow-none"
            >
              <FilterCommandBox
                label={filter.label}
                options={filter.options}
                value={getActiveValues(filter.id)}
                onChange={(selected) => handleFilterChange(filter.id, selected)}
              />
            </PopoverContent>
          </Popover>
        {/each}
        <div class="flex justify-between pt-4">
          {#if activeFilterCount > 0}
            <button
              class="text-red-500 text-sm font-medium"
              onclick={clearAllFilters}
            >
              Clear all
            </button>
          {/if}
          <button
            class="bg-brand-dark-orange rounded-md px-4 py-2 text-sm font-medium text-white"
            onclick={() => (isDrawerOpen = false)}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
</div>
