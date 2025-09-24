<script>
  import { page } from "$app/state"
  import { m } from "$src/lib/paraglide/messages"
  import { localizeHref } from "$src/lib/paraglide/runtime"
</script>

<div class="w-full rounded-none h-10 sm:h-16 gap-0.5 flex pb-0.5">
  <a
    href={localizeHref("/funding")}
    class={`relative bg-brand-primary-dark font-medium text-body6 text-white w-1/2 h-full overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 flex items-center justify-center
      ${page.url.pathname === localizeHref("/funding") ? "bg-primary text-white sm:font-bold" : ""}`}
  >
    {m.search()}
  </a>

  <a
    href={localizeHref("/funding-ai-search")}
    class={`relative bg-brand-primary-dark font-medium text-body6 text-white w-1/2 h-full gap-2 sm:gap-3 overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 flex items-center justify-center
      ${page.url.pathname === localizeHref("/funding-ai-search") ? "bg-primary text-white sm:font-bold" : ""}`}
  >
    {m.ai_search()}
    <span
      class="h-[11px] sm:h-[19px] bg-brand-dark-orange text-white text-[8px] sm:text-xs px-1 sm:px-3 rounded-full flex items-center justify-center"
    >
      {m.new()}
    </span>
  </a>
</div>
