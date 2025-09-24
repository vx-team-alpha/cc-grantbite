<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import { BellIcon } from "$lib/svg"
  import { PlayIcon, Plus } from "lucide-svelte"
  import type { PageData } from "./$types"
  import NotificationDetailCard from "$src/lib/components/cards/notification-detail-card.svelte"
  import SearchResultCard from "$src/lib/components/SearchResultCard.svelte"
  import { DemoProjects } from "$src/lib/components/constants"
  import { localizeHref } from "$src/lib/paraglide/runtime"
  import { m } from "$src/lib/paraglide/messages"
  import { formatNotification } from "$lib/notificationUtils"

  const { data } = $props<{
    data: PageData
  }>()

  const projects = DemoProjects || []

  const notifications = formatNotification(data.notifications || [])
</script>

<svelte:head>
  <title>{m.notifications_page_title()}</title>

  <meta name="description" content={m.notifications_page_description()} />
</svelte:head>

<div class="app-container min-h-screen">
  <div class="flex justify-between items-center mt-11 pb-3">
    <a href={localizeHref("/notifications")}>
      <Button
        variant="ghost"
        size="sm"
        class="gap-2 sm:gap-4 text-brand-primary rounded-none group "
        asChild
      >
        <PlayIcon class=" fill-brand-primary rotate-180" />
        <span class="group-hover:underline">{m.back_to_notification()}</span>
      </Button>
    </a>
  </div>
  <div class="w-full h-full flex flex-col items-center">
    {#if notifications.length > 0}
      {#each notifications as notification, i}
        <div class="space-y-12 w-full max-w-5xl">
          <NotificationDetailCard project={notification} className="w-full" />
          <div>
            <h1 class="font-bold text-h2">{m.funding_grant_heading()}</h1>

            {#each projects as item}
              <SearchResultCard {item} />
            {/each}
          </div>
        </div>
      {/each}
    {:else}
      <div class="flex flex-col items-center justify-center gap-8 my-auto">
        <img
          src="/images/moneky-with-bell.jpg"
          alt="monkey with bell"
          class="size-20"
        />

        <p class="text-lg sm:text-xl font-medium text-center max-w-xl">
          {m.no_notifications_message()}
        </p>

        <a href="notifications/create">
          <Button class="" asChild
            ><Plus />{m.create_new_notification_button()}</Button
          >
        </a>
      </div>
    {/if}
  </div>
</div>
