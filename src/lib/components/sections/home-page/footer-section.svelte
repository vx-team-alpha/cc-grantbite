<script>
  import { m } from "$lib/paraglide/messages"
  import { localizeHref } from "$src/lib/paraglide/runtime"
  import Logo from "$lib/assets/funding_logo_light.svg"
</script>

<footer class="bg-brand-primary-dark text-white pt-12 px-6">
  <div class="app-container">
    <div
      class="flex flex-col sm:flex-row gap-8 justify-between items-start mb-8"
    >
      <div>
        <a href={localizeHref("/")}>
          <img src={Logo} alt="grantzilla-logo" class="h-7 sm:h-12" />
        </a>
      </div>

      <nav class="flex gap-8">
        <a
          href="/imprint"
          class="text-white hover:text-brand-dark-orange transition-colors"
        >
          {m.footer_imprint()}
        </a>
        <a
          href="/privacy-policy"
          class="text-white hover:text-brand-dark-orange transition-colors"
        >
          {m.footer_privacy_policy()}
        </a>
      </nav>
    </div>

    <div class="text-center border-t border-white/10 py-6">
      <p class="text-white text-sm">{m.footer_copyright_notice()}</p>
    </div>
  </div>
</footer>
