<script lang="ts" context="module">
  import Button from "$lib/components/ui/button/button.svelte"
  import { m } from "$lib/paraglide/messages"

  export { default as FundingButton } from "$lib/components/ui/funding-finder-button/funding-button.svelte"
</script>

<section class="relative py-10">
  <div class="relative z-20 app-container">
    <div class="w-full max-w-3xl space-y-8">
      <h3
        class="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 leading-tight"
      >
        {m.main_call_to_action_never_miss_out()}
      </h3>
      <div>
        <div class="flex items-center gap-4">
          <div
            class="flex-shrink-0 w-10 h-10 bg-[#FAB900] rounded-full flex items-center justify-center text-white font-bold text-lg"
          >
            1
          </div>
          <div class="pt-1">
            <p class="text-base sm:text-xl font-medium text-gray-900">
              {m.main_call_to_action_step_1()}
            </p>
          </div>
        </div>

        <div
          class="ml-5 w-px h-7 sm:h-12 border-l-2 border-dashed border-gray-400"
        ></div>

        <div class="flex items-center gap-4">
          <div
            class="flex-shrink-0 w-10 h-10 bg-[#FAB900] rounded-full flex items-center justify-center text-white font-bold text-lg"
          >
            2
          </div>
          <div class="pt-1">
            <p class="text-base sm:text-xl font-medium text-gray-900">
              {m.main_call_to_action_step_2()}
            </p>
          </div>
        </div>

        <div
          class="ml-5 w-px h-7 sm:h-12 border-l-2 border-dashed border-gray-400"
        ></div>

        <div class="flex items-start gap-4">
          <div
            class="flex-shrink-0 w-10 h-10 bg-[#FAB900] rounded-full flex items-center justify-center text-white font-bold text-lg"
          >
            3
          </div>
          <div class="pt-1">
            <p class="text-base sm:text-xl font-medium text-gray-900">
              {m.main_call_to_action_step_3()}
            </p>
          </div>
        </div>
      </div>
      <div class="max-w-50 md:max-w-sm">
        <a href="/login/sign_up">
          <Button variant="primary" class="w-full">{m.navbar_register()}</Button
          >
        </a>
      </div>
    </div>
  </div>
  <div
    class="  lg:block absolute -bottom-50 md:top-0 right-0 z-10 max-w-2/5 pointer-none:"
  >
    <img
      src="/images/leafs.svg"
      alt="Decorative leaves"
      width={1000}
      height={500}
      class="h-[500px] w-full"
    />
  </div>
</section>
