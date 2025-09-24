<script>
  import * as Avatar from "$lib/components/ui/avatar/index.js"
  import RatingStars from "../rating-stars.svelte"
</script>

<div class="flex max-w-[432px] w-full h-[320px] bg-brand-light-blue">
  <div class="flex flex-col items-center text-center space-y-5 m-auto max-w-xs">
    <RatingStars value={4} />
    <p class="text-xs leading-5">
      Cras ac justo quis ante fringilla elementum eget condimentum odio. Morbi
      rhoncus lectus non lacus pellentesque, id faucibus elit sollicitudin.
      Quisque velr.
    </p>
    <p class="font-bold text-sm leading-5">Louis Ferguson</p>

    <Avatar.Root class="size-16 border-2">
      <Avatar.Image
        src="/images/profile.png"
        alt="Louis Ferguson"
        width={64}
        height={64}
      />
      <Avatar.Fallback>LF</Avatar.Fallback>
    </Avatar.Root>
  </div>
</div>
