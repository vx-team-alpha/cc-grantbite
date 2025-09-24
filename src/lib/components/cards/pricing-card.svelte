<script lang="ts">
  import Button from "$src/lib/components/ui/button/button.svelte"
  import CardContent from "$src/lib/components/ui/card/card-content.svelte"
  import CardHeader from "$src/lib/components/ui/card/card-header.svelte"
  import CardTitle from "$src/lib/components/ui/card/card-title.svelte"
  import Card from "$src/lib/components/ui/card/card.svelte"
  import { cn } from "$src/lib/utils"
  import { Check } from "lucide-svelte"

  interface Props {
    title: string
    price: string
    description: string
    trialInfo: string
    features: string[]
    buttonText: string
  }

  const { title, buttonText, description, features, price, trialInfo }: Props =
    $props()
</script>

<Card
  class={cn(
    "relative w-full max-w-[348px] md:h-[711px] shadow-sm rounded-3xl border border-muted p-5 ",
    title == "Pro" && "teal-gradient",
  )}
>
  <div
    class={cn(
      "absolute md:relative md:right-0 right-4 border border-brand-dark-orange w-fit px-2 md:px-4 py-1 rounded-full text-brand-dark-orange ms-auto",
      title == "Pro" ? "visible" : "invisible",
    )}
  >
    <p>Most Popular</p>
  </div>

  <CardHeader class={cn("p-0 space-y-1.5", title == "Pro" && "text-white")}>
    <CardTitle class="text-2xl md:text-3xl leading-12 font-bold "
      >{title}</CardTitle
    >
    <p class="text-muted-foreground text-xl md:text-2xl leading-12 capitalize">
      {price}
    </p>
    <p class="text-muted-foreground text-sm md:text-lg">{description}</p>
  </CardHeader>

  <CardContent
    class={cn("space-y-6 mt-2 p-0", title == "Pro" && " text-white")}
  >
    <div>
      <Button
        class={cn(
          "w-full text-base font-semibold py-6 rounded-lg",
          title == "Pro" && "bg-white text-black",
        )}
      >
        {buttonText}
      </Button>
      <p class="text-sm mt-4 mb-2">{trialInfo}</p>
    </div>

    <ul class="space-y-3 md:space-y-4 text-sm text-muted-foreground">
      {#each features as feature}
        <li class="flex items-start gap-2 text-base md:text-lg">
          <Check class="bg-teal-600 text-white rounded-full p-1 size-6" />
          {feature}
        </li>
      {/each}
    </ul>
  </CardContent>
</Card>
