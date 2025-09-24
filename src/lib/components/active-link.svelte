<script lang="ts">
  import { page } from "$app/state"
  import { cn } from "../utils"

  type Props = {
    shouldHaveActiveState?: boolean
    className?: string
    activeClass?: string
    href: string
    onclick?: (event: MouseEvent) => void
    children?: () => any
  }

  let {
    className,
    activeClass,

    href,
    shouldHaveActiveState = true,
    onclick,
    children,
  }: Props = $props()

  const isActive = $derived(page.url.pathname === href && shouldHaveActiveState)
</script>

<a
  {href}
  class:active={isActive}
  class={cn(
    className,
    isActive && "!text-brand-dark-orange hover:!text-brand-primary",
    isActive && activeClass,
  )}
  {onclick}
>
  {@render children?.()}
</a>

<style>
  /* .active {
    font-weight: bold;
    text-decoration: underline;
  } */
</style>
