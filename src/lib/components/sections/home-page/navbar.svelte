<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet/index.js"
  import { getLocale, localizeHref } from "$lib/paraglide/runtime.js"

  import LanguageSelector from "$lib/components/lang-selector.svelte"
  import { Menu } from "lucide-svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import ActiveLink from "$lib/components/active-link.svelte"
  import { m } from "$lib/paraglide/messages"
  import { NavBarHideLogin, NavBarHideMoreItems } from "$src/config"
  import UserDropdownMenu from "../../user-dropdown-menu.svelte"
  import { cn } from "$src/lib/utils"
  import { page } from "$app/state"
  import Logo from "$lib/assets/fundingfinder_logo.svg"
  interface NavbarProps {
    isAuthenticated: boolean
  }
  let { isAuthenticated }: NavbarProps = $props()
  let isDrawerOpen = $state(false)

  const toggleDrawer = () => {
    isDrawerOpen = !isDrawerOpen
  }
</script>

<div
  id="navbar-section"
  class={cn(
    "bg-white --z-30 relative ",
    page.url.origin + page.url.pathname === localizeHref("funding") ||
      page.url.origin + page.url.pathname === localizeHref("funding-ai-search")
      ? ""
      : "border-b-4 border-brand-primary",
  )}
>
  <nav
    class="app-container mx-auto w-full py-4.5 flex items-center justify-between relative"
  >
    <a href={localizeHref("/")}>
      <img src={Logo} alt="grantzilla-logo" class="h-7 sm:h-12" />
    </a>
    <div class="hidden lg:flex items-center gap-6 text-base font-medium">
      {#if !NavBarHideMoreItems}
        {#if isAuthenticated}
          <ActiveLink href={localizeHref("/funding")}
            >{m.navbar_funding()}</ActiveLink
          >
          <ActiveLink href={localizeHref("/notifications")}
            >{m.navbar_manage_notifications()}</ActiveLink
          >

          <ActiveLink href={localizeHref("/bookmarks")}
            >{m.navbar_bookmarks()}</ActiveLink
          >
        {:else}
          <!-- <ActiveLink href={localizeHref("/funding")}
            >{m.navbar_funding()}</ActiveLink
          >

          <ActiveLink href={localizeHref("/pricing")}
            >{m.navbar_pricing()}</ActiveLink
          > -->
        {/if}
      {/if}
    </div>

    <!-- Desktop -->
    <div class="hidden md:flex items-center gap-4">
      <!-- Language Selector -->

      <LanguageSelector />

      {#if !NavBarHideLogin}
        {#if isAuthenticated}
          <UserDropdownMenu />
        {:else}
          <div class="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <a href={localizeHref("/login/sign_up")}>
              <Button variant="primary" class="w-full md:w-auto"
                >{m.navbar_register()}</Button
              >
            </a>
            <a href={localizeHref("/login/sign_in")}>
              <Button asChild variant="outline" class="w-full md:w-auto"
                >{m.navbar_login()}</Button
              >
            </a>
          </div>
        {/if}
      {/if}
      <!-- Auth Buttons -->
    </div>

    <div class="md:hidden">
      <Sheet.Root open={isDrawerOpen} onOpenChange={toggleDrawer}>
        <Sheet.SheetTrigger
          class="md:hidden hover:cursor-pointer p-1.5 hover:bg-gray-100 rounded-md"
          aria-label={m.navbar_open_menu()}
        >
          <span class="sr-only">{m.navbar_open_menu()}</span>
          <Menu class="w-5 h-5" />
        </Sheet.SheetTrigger>
        <Sheet.SheetContent side="right" class="w-72 px-6 bg-white">
          <Sheet.SheetTitle />
          <Sheet.SheetHeader class="px-0 mt-4 pb-0">
            <div class="flex justify-between items-center">
              <!-- <span class="font-oswald text-left text-2xl">FundingFinder</span> -->
              {#if isAuthenticated}
                <a
                  href={localizeHref("/account")}
                  class="bg-brand-primary ml-auto size-8 flex items-center justify-center rounded-full hover:bg-brand-primary/90"
                >
                  <span class="sr-only">{m.navbar_account()}</span>
                  <span class="size-4">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-full h-full"
                    >
                      <path
                        d="M12 0.5C13.525 0.5 14.9875 1.1058 16.0659 2.18414C17.1442 3.26247 17.75 4.72501 17.75 6.25C17.75 7.77499 17.1442 9.23753 16.0659 10.3159C14.9875 11.3942 13.525 12 12 12C10.475 12 9.01247 11.3942 7.93414 10.3159C6.8558 9.23753 6.25 7.77499 6.25 6.25C6.25 4.72501 6.8558 3.26247 7.93414 2.18414C9.01247 1.1058 10.475 0.5 12 0.5ZM12 14.875C18.3538 14.875 23.5 17.4481 23.5 20.625V23.5H0.5V20.625C0.5 17.4481 5.64625 14.875 12 14.875Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </a>
              {/if}
            </div>
          </Sheet.SheetHeader>
          <div class="mt- flex flex-col gap-5">
            <LanguageSelector />
            <div class="grid grid-flow-row space-y-6 text-base font-medium">
              {#if !NavBarHideMoreItems}
                {#if isAuthenticated}
                  <ActiveLink
                    href={localizeHref("/funding")}
                    onclick={toggleDrawer}>{m.navbar_funding()}</ActiveLink
                  >
                  <ActiveLink
                    href={localizeHref("/notifications")}
                    onclick={toggleDrawer}
                    >{m.navbar_manage_notifications()}</ActiveLink
                  >

                  <ActiveLink
                    href={localizeHref("/bookmarks")}
                    onclick={toggleDrawer}>{m.navbar_bookmarks()}</ActiveLink
                  >
                  <div class="w-full h-0.5 bg-brand-gray"></div>
                  <ActiveLink
                    href={localizeHref("/profile")}
                    onclick={toggleDrawer}>{m.navbar_profile()}</ActiveLink
                  >
                  <ActiveLink
                    href={localizeHref("/settings")}
                    onclick={toggleDrawer}>{m.navbar_settings()}</ActiveLink
                  >
                  <ActiveLink
                    href={localizeHref("/account/sign_out")}
                    onclick={toggleDrawer}>{m.navbar_logout()}</ActiveLink
                  >
                {:else}
                  <!-- <ActiveLink
                    href={localizeHref("/funding")}
                    onclick={toggleDrawer}>{m.navbar_funding()}</ActiveLink
                  >

                  <ActiveLink
                    href={localizeHref("/pricing")}
                    onclick={toggleDrawer}>{m.navbar_pricing()}</ActiveLink
                  > -->
                {/if}
              {/if}
            </div>

            {#if !NavBarHideLogin}
              {#if !isAuthenticated}
                <a
                  class="block"
                  href={localizeHref("/login/sign_up")}
                  onclick={toggleDrawer}
                >
                  <Button asChild variant="primary" class="w-full"
                    >{m.navbar_register()}</Button
                  >
                </a>
                <a
                  class="block"
                  href={localizeHref("/login/sign_in")}
                  onclick={toggleDrawer}
                >
                  <Button asChild variant="outline" class="w-full"
                    >{m.navbar_login()}</Button
                  >
                </a>
              {/if}
            {/if}
          </div>
        </Sheet.SheetContent>
      </Sheet.Root>
    </div>
  </nav>
</div>
