<script lang="ts">
  import { goto } from "$app/navigation"
  import { m } from "../paraglide/messages"
  import { localizeHref } from "../paraglide/runtime"
  import Button from "./ui/button/button.svelte"
</script>

<Button
  variant="link"
  size="sm"
  class="inline-flex items-center gap-4 text-brand-primary font-semibold text-lg hover:underline"
  onclick={() => {
    history.back()
  }}
>
  <svg
    width="8"
    height="14"
    viewBox="0 0 8 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.28732 13.693C7.42438 13.6362 7.54152 13.54 7.62394 13.4167C7.70635 13.2933 7.75033 13.1483 7.75032 13V0.999951C7.75019 0.851711 7.70613 0.706834 7.62371 0.583619C7.54129 0.460403 7.4242 0.364375 7.28724 0.307664C7.15028 0.250953 6.99958 0.236101 6.85418 0.264986C6.70878 0.29387 6.5752 0.365194 6.47032 0.469951L0.470317 6.46995C0.329866 6.61058 0.250977 6.8012 0.250977 6.99995C0.250977 7.1987 0.329866 7.38933 0.470317 7.52995L6.47032 13.53C6.57513 13.6348 6.70868 13.7063 6.8541 13.7353C6.99952 13.7643 7.15028 13.7496 7.28732 13.693Z"
      fill="#39988B"
    />
  </svg>

  {m.details_funding_back_to_search()}
</Button>
