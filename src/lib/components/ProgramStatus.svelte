<script lang="ts">
  /**
   * Component that displays a program status as a badge
   */

  import * as enums from "$lib/data_values/enums"
  import { translators } from "$lib/translators"

  let { status = "Other" } = $props<{
    status: enums.ProgramStatus
  }>()

  // Map of statuses to their respective background colors
  const statusConfig = {
    Planned: {
      bgColor: "bg-gradient-to-r from-[#09A9DE] to-[#7DDEFF]",
    },
    Open: {
      bgColor: "bg-gradient-to-r from-[#00BE57] to-[#01F371]",
    },
    Closed: {
      bgColor: "bg-gradient-to-r from-[#A0A0A0] to-[#696969]",
    },
    Cancelled: {
      bgColor: "bg-gradient-to-r from-[#BDB76B] to-[#E7DE75]",
    },
    Other: {
      bgColor: "bg-gradient-to-r from-[#A0A0A0] to-[#696969]",
    },
  } as const

  // Ensure status is a valid key
  const validStatus = $derived(
    Object.keys(statusConfig).includes(status) ? status : "Other",
  ) as keyof typeof statusConfig

  // Get the configuration for the current status
  const config = $derived(statusConfig[validStatus])
</script>

<div
  class="flex flex-col justify-center items-center p-[1px] px-6 gap-1.5 h-[30px] {config.bgColor} shadow-md rounded-md"
>
  <span
    class="w-full h-6 font-bold text-body-2 leading-[normal] flex items-center justify-center text-white"
  >
    {translators.translateProgramStatus(validStatus as enums.ProgramStatus)}
  </span>
</div>
