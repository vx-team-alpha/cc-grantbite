<script lang="ts">
  import * as Command from "$lib/components/ui/command"
  import { m } from "$lib/paraglide/messages"

  export let label: string
  export let options: { label: string; value: string }[] = []
  export let value: string[] = []
  export let onChange: (selected: string[]) => void = () => {}

  let inputValue = ""

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()])
      }
      inputValue = ""
    }
  }

  const handleSelect = (val: string) => {
    if (!value.includes(val)) {
      onChange([...value, val])
    }
  }
</script>

<div class="space-y-2">
  <Command.Root class="shadow-md">
    <div class="p-4">
      <p class="text-lg font-bold mb-2">{label}</p>

      <div
        class="border border-blue-500 bg-white text-brand-gray rounded-md text-sm font-normal w-full"
      >
        <Command.Input
          placeholder={`${m.filter_command_box_search()} ${label}`}
          bind:value={inputValue}
          onkeydown={handleKeyDown}
        />
      </div>
    </div>
    <Command.List
      class="w-full max-w-sm p-4 space-y-4 cursor-pointer rounded-b-md shadow-lg bg-white"
    >
      <Command.Empty>No results found.</Command.Empty>
      {#each options as opt (opt.value)}
        <Command.Item
          onSelect={() => handleSelect(opt.value)}
          class="cursor-pointer font-semibold hover:bg-blue-400/10 rounded-md px-3 py-2 text-sm"
        >
          {opt.label}
        </Command.Item>
      {/each}
    </Command.List>
  </Command.Root>
</div>
