<script>
  import Button from "$lib/components/ui/button/button.svelte"
  import { m } from "$lib/paraglide/messages"

  export let className = ""
</script>

<div class=" p-6 md:p-8 bg-white border border-brand-primary/50 {className}">
  <div
    class="app-container flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8"
  >
    <div class="flex-1 space-y-4">
      <h2 class="text-xl md:text-3xl font-bold text-gray-900">
        {m.add_program_to_finder_title()}
      </h2>
      <p
        class="text-gray-700 text-sm font-semibold sm:text-base leading-relaxed max-w-2xl"
      >
        {m.add_program_to_finder_subtitle()}
      </p>
      <div class="flex-shrink-0 flex lg:hidden justify-center lg:justify-end">
        <div class="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 relative">
          <img
            src="/images/monkey.png"
            alt="Magnifying glass with smiling face illustration"
            class="object-contain"
            sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
          />
        </div>
      </div>
      <a
        href="https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=rOS1FGc99U-rDwhOMkAgs1wwuCDnBNtEm7N0_qVNOY5UNzlIT0lJRkRTUzBQTUhNVldFRTZXUDMxQS4u"
        target="_blank"
        class="flex max-w-xs"
      >
        <Button variant="primary" class="sm:w-full mx-auto">
          {m.add_program_to_finder_submit()}
        </Button>
      </a>
    </div>

    <div class="flex-shrink-0 hidden lg:flex justify-center lg:justify-end">
      <div class="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 relative">
        <img
          src="/images/monkey.png"
          alt="Magnifying glass with smiling face illustration"
          class="object-contain"
          sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
        />
      </div>
    </div>
  </div>
</div>
