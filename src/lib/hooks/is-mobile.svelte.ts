import { BREAKPOINTS } from "$lib/utils"
import { MediaQuery } from "svelte/reactivity"

export class IsMobile extends MediaQuery {
  constructor() {
    super(`max-width: ${BREAKPOINTS.md.value - 1}${BREAKPOINTS.md.unit}`)
  }
}
