<script lang="ts">
  import CreateNotificationForm from "$lib/components/forms/create-notification-form.svelte"
  import { m } from "$src/lib/paraglide/messages"

  import type { PageData } from "./$types"
  export let data: PageData

  const notificationId = data.notificationId
  const title = notificationId
    ? m.settings_update_notification()
    : m.settings_create_notification()
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<div class="px-6 py-12 sm:py-16">
  <div
    class="flex flex-col gap-8 mx-auto items-center justify-center px-4 sm:px-16 py-7 sm:py-12 w-full border max-w-3xl border-brand-light-gray rounded-lg"
  >
    <h3 class="font-bold text-xl sm:text-3xl">
      {title}
    </h3>

    <CreateNotificationForm data={data.form} id={notificationId} />
    <!-- <SuperDebug data={data.form} /> -->
  </div>
</div>
