<script lang="ts">
  import {
    BankIcon,
    ConvertIcon,
    DollarCircleIcon,
    HandDollarIcon,
    HybridIcon,
    MoneyBag,
    MoneyBag2,
    RepayIcon,
    StarIcon,
    GrantIcon,
  } from "$lib/svg"

  import * as enums from "$lib/data_values/enums"
  import { translators } from "$lib/translators"

  /**
   * Component that displays a financial instrument type as a badge
   */
  let { type = "Other" } = $props<{ type: enums.FinancialInstrumentType }>()

  // Map of types to their respective colors and icons
  const typeConfig = {
    Grant: {
      color: "text-[#00B8A9] border-[#00B8A9]",
      icon: GrantIcon,
    },
    Repayable: {
      color: "text-[#F2994A] border-[#F2994A]",
      icon: RepayIcon,
    },
    Loan: {
      color: "text-[#ED4C49] border-[#ED4C49]",
      icon: BankIcon,
    },
    Convertible: {
      color: "text-[#2D9CDB] border-[#2D9CDB]",
      icon: ConvertIcon,
    },
    Equity: {
      color: "text-[#4B4AEF] border-[#4B4AEF]",
      icon: DollarCircleIcon,
    },
    Hybrid: {
      color: "text-[#B53DE1] border-[#B53DE1]",
      icon: HybridIcon,
    },
    Guarantee: {
      color: "text-[#27AE60] border-[#27AE60]",
      icon: StarIcon,
    },
    Incentive: {
      color: "text-[#FF7A59] border-[#FF7A59]",
      icon: MoneyBag,
    },
    Prize: {
      color: "text-[#3965F5] border-[#3965F5]",
      icon: HandDollarIcon,
    },
    Other: {
      color: "text-[#444379] border-[#444379]",
      icon: MoneyBag2,
    },
  } as const

  // Ensure type is a valid key
  const validType = $derived(
    Object.keys(typeConfig).includes(type) ? type : "Other",
  ) as keyof typeof typeConfig

  // Get the configuration for the current type
  const config = $derived(typeConfig[validType])
  const CurrentIcon = $derived(config.icon)
</script>

<div
  class="box-border flex flex-col justify-center items-center p-1 px-2.5 gap-1.5 h-[30px] border border-solid rounded-md {config.color}"
>
  <div class="flex flex-row items-center p-0 gap-1.5 h-6 {config.color}">
    <CurrentIcon />
    <span
      class="h-6 font-exo font-bold text-body-2 leading-[60px] flex items-center capitalize {config.color}"
    >
      {translators.translateFinancialInstrumentType(
        validType as enums.FinancialInstrumentType,
      )}
    </span>
  </div>
</div>
