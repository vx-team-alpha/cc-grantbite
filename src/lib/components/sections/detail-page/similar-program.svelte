<script lang="ts">
  import { m } from "$lib/paraglide/messages"

  export let similarPrograms: {
    label: string
    link: string
  }[] = []
</script>

<section class="mb-10">
  <h2 class="text-lg md:text-3xl font-bold text-black mb-10 mt-25">
    {m.details_similar_programs()}
  </h2>
  {#if similarPrograms.length > 0}
    <div class="flex flex-col gap-6">
      {#each similarPrograms as program (program.link)}
        <a
          target="_self"
          href={program.link}
          class="font-bold text-brand-blue hover:text-brand-primary underline"
          >{program.label}</a
        >
      {/each}
    </div>
  {:else}
    <p class="text-gray-500">{m.details_no_similar_programs_found()}.</p>
  {/if}
</section>
