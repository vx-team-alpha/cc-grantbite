<script>
  import clsx from "clsx"

  /** @type {'primary' | 'outline' | 'secondary' | 'ghost'} */
  export let variant = "primary"
  /** @type {'icon' | 'sm' | 'default' | 'lg' | 'xl' | 'full'} */
  export let size = "default"
  export let className = ""
  export let disabled = false
  /** @type {'button' | 'submit' | 'reset'} */
  export let type = "button"
  export let onClick = () => {}

  const base =
    "inline-flex items-center justify-center font-medium transition-colors hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    primary: "bg-brand-primary text-white hover:bg-[#F59E0B]",
    outline:
      "border border-brand-primary text-brand-primary bg-transparent hover:bg-[#F59E0B] hover:text-white hover:border-[#F59E0B]",
    secondary: "bg-[#F59E0B] text-white hover:bg-brand-primary",
    ghost: "bg-transparent text-brand-primary hover:border-b-primary/10",
  }

  const sizes = {
    icon: "h-10 w-10 rounded-lg",
    sm: "h-9 px-4 py-2 text-sm rounded-md",
    default: "h-10 px-6 py-2 text-sm rounded-md",
    lg: "h-12 px-8 py-3 text-base rounded-md",
    xl: "h-12 px-16 py-3 text-base rounded-md",
    full: "h-12 w-full px-8 py-3 text-base rounded-md",
  }
</script>

<button
  {type}
  class={clsx(base, variants[variant], sizes[size], className)}
  on:click={onClick}
  {disabled}
>
  <slot />
</button>
