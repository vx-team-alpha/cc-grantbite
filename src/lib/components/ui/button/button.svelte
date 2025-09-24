<script lang="ts" module>
  import { cn, type WithElementRef } from "$lib/utils.js"
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from "svelte/elements"
  import { type VariantProps, tv } from "tailwind-variants"

  export const buttonVariants = tv({
    base: "txt-btn inline-flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer rounded-[10px] font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    variants: {
      variant: {
        default:
          "bg-brand-primary text-white border border-transparent hover:border-brand-dark-orange hover:text-brand-dark-orange hover:bg-transparent",
        primary:
          "bg-brand-primary text-white border border-transparent hover:border-brand-dark-orange hover:text-brand-dark-orange hover:bg-transparent",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 -dark:focus-visible:ring-destructive/40 -dark:bg-destructive/60",
        outline:
          "border border-brand-primary bg-transparent text-brand-primary hover:border-brand-dark-orange hover:bg-brand-dark-orange hover:text-white ",
        outline_secondary:
          "border border-brand-dark-orange bg-transparent text- hover:border-brand-primary hover:bg-brand-primary hover:text-white ",
        secondary: "bg-brand-dark-orange text-white  hover:bg-brand-primary",
        ghost: " hover:bg-transparents hover:text-accent-foreground ",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11.5 px-6 sm:px-9 py-2 ",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12.5 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-9 bg-brand-primary !text-white border border-transparent hover:bg-brand-dark-orange  ",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  })

  export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"]
  export type ButtonSize = VariantProps<typeof buttonVariants>["size"]

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
      variant?: ButtonVariant
      size?: ButtonSize
      asChild?: boolean
    }
</script>

<script lang="ts">
  let {
    class: className,
    variant = "default",
    size = "default",
    ref = $bindable(null),
    href = undefined,
    type = "button",
    disabled,
    asChild,
    children,
    ...restProps
  }: ButtonProps = $props()
</script>

{#if href}
  <a
    bind:this={ref}
    data-slot="button"
    class={cn(buttonVariants({ variant, size }), className)}
    href={disabled ? undefined : href}
    aria-disabled={disabled}
    role={disabled ? "link" : undefined}
    tabindex={disabled ? -1 : undefined}
    {...restProps}
  >
    {@render children?.()}
  </a>
{:else if asChild}
  <span
    bind:this={ref}
    data-slot="button"
    class={cn(buttonVariants({ variant, size }), className)}
  >
    {@render children?.()}
  </span>
{:else}
  <button
    bind:this={ref}
    data-slot="button"
    class={cn(buttonVariants({ variant, size }), className)}
    {type}
    {disabled}
    {...restProps}
  >
    {@render children?.()}
  </button>
{/if}
