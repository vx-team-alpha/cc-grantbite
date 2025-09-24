<script lang="ts">
  import { Star } from "lucide-svelte"

  export let value: number = 0

  $: value = Math.min(Math.max(value, 0), 5)

  const stars = Array.from({ length: 5 }, (_, i) => i + 1)

  const getStarClass = (starNum: number) =>
    `w-6 h-6 ${starNum <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`
</script>

<div class="flex items-center space-x-1">
  {#each stars as starNum}
    <Star class={getStarClass(starNum)} />
  {/each}
</div>
