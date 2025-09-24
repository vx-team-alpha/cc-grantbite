<script>
  import { m } from "$lib/paraglide/messages"
</script>

<section class="pt-16 py-8 sm:py-16 z-10 bg-[#ECEDEB33]">
  <div class="max-w-7xl px-4 w-full mx-auto">
    <div class="grid gap-10 grid-cols-2 lg:grid-cols-3 justify-items-center">
      <!-- EU Programs -->

      <div class="flex items-center justify-center gap-2 sm:gap-6 text-center">
        <img
          src="/images/stat-1.svg"
          alt="Earth"
          width="110"
          height="110"
          class="size-[50px] sm:size-24"
        />

        <div class="text-center">
          <p class="text-bodylg font-bold text-brand-dark-orange">+6,000</p>
          <p class="text-body5 font-semibold text-gray-800 z-10">
            {m.stats_eu_programs()}
          </p>
        </div>
      </div>

      <!-- National Programs -->

      <div class="flex items-center justify-center gap-2 sm:gap-6">
        <img
          src="/images/stat-2.svg"
          alt="Earth"
          width="110"
          height="110"
          class="size-[50px] sm:size-24"
        />

        <div class="text-center">
          <p class="text-bodylg font-bold text-brand-dark-orange">+3,000</p>
          <p class="text-body5 font-semibold text-gray-800 z-10">
            {m.stats_national_programs()}
          </p>
        </div>
      </div>

      <!-- Local Programs -->

      <div
        class="flex col-span-2 lg:col-span-1 items-center justify-center gap-2 sm:gap-6"
      >
        <img
          src="/images/stat-3.svg"
          alt="Earth"
          width="110"
          height="110"
          class="size-[50px] sm:size-24"
        />

        <div class="text-center">
          <p class="text-bodylg font-bold text-brand-dark-orange">+15,000</p>
          <p class="text-body5 font-semibold text-gray-800 z-10">
            {m.stats_local_programs()}
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
