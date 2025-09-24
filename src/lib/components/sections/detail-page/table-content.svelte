<script lang="ts">
  import { m } from "$lib/paraglide/messages"

  export let tocItems: { text: string; id: string; level: number }[] = []
</script>

{#if tocItems.length > 0}
  <nav class="mb-12 p-4 bg-gray-50 border border-gray-200 rounded-xl">
    <h2 class="text-lg md:text-3xl font-bold text-black mb-4">
      {m.details_funding_table_of_contents()}
    </h2>
    <ul class="space-y-3">
      {#each tocItems as item (item.id)}
        <li>
          <a
            href={"#" + item.id}
            class="text-brand-blue hover:text-brand-primary underline text-sm"
          >
            {item.text}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}
