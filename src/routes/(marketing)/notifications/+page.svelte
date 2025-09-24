<script lang="ts">
  import NotificationCard from "$lib/components/cards/notification-card.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { BellIcon } from "$lib/svg"
  import { Plus } from "lucide-svelte"
  import type { PageData } from "./$types"
  import { cn } from "$src/lib/utils"
  import { m } from "$lib/paraglide/messages"
  import { formatNotification } from "$lib/notificationUtils"

  const props = $props<{
    data: PageData
  }>()

  let formattedNotifications = $derived(
    formatNotification(props.data.notifications),
  )
</script>

<svelte:head>
  <title>{m.notifications_title()}</title>
  <meta name="description" content={m.notifications_meta_description()} />
</svelte:head>

<div class="app-container min-h-screen">
  <div class="flex justify-between items-center mt-11 pb-6 border-b-2">
    <div class="flex items-center justify-center gap-5">
      <BellIcon className="fill-brand-primary size-12 stroke-brand-primary" />
      <h1 class="font-bold text-2xl md:text-4xl">
        {m.notifications_heading()}
      </h1>
    </div>
    {#if props.data.notifications.length > 0}
      <a href="notifications/create">
        <Button variant="outline" class=" hidden md:flex max-w-2xs">
          <Plus />{m.notifications_new_button()}
        </Button>
      </a>
      <a href="notifications/create" class="md:hidden flex">
        <Button variant="outline" class=" max-w-2xs">
          <Plus />{m.new()}
        </Button>
      </a>
    {/if}
  </div>
  <div class="w-full min-h-screen flex flex-col items-center">
    {#if formattedNotifications.length > 0}
      {#each formattedNotifications as project, i}
        <NotificationCard
          {project}
          className={cn(i == 0 ? "w-full" : "border-t w-full")}
        />
      {/each}
    {:else}
      <div class="flex flex-col items-center justify-center gap-8 my-auto">
        <img
          src="/images/empty-monkey-placeholder.png"
          alt={m.notifications_empty_image_alt()}
          class="sm:size-20 size-16"
        />
        <p class="text-xs sm:text-lg font-medium text-center max-w-xl">
          {m.notifications_empty_text()}
        </p>
        <a href="notifications/create">
          <Button class="" asChild>
            <Plus />{m.notifications_new_button()}
          </Button>
        </a>
      </div>
    {/if}
  </div>
</div>
