<script lang="ts">
  import "@beyonk/gdpr-cookie-consent-banner/banner.css"
  // @ts-expect-error we have no typings for this library
  import Banner from "@beyonk/gdpr-cookie-consent-banner"
  import { m } from "$lib/paraglide/messages"

  // Your Google Analytics Measurement ID
  const GA_MEASUREMENT_ID = "G-ENJTDC5T2F"
  let googleAnalyticsScriptLoaded = false
  let showBanner = true // Control banner visibility

  // Check if consent was already given on component mount
  import { onMount } from "svelte"

  onMount(() => {
    // Check if the consent cookie already exists
    const consentCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("funding_finder_cookie_consent="))

    if (consentCookie) {
      showBanner = false
    }
  })

  interface AgreementEventDetail {
    agreed: boolean
  }

  function initAnalytics(event: CustomEvent<AgreementEventDetail>) {
    const { agreed } = event.detail

    // Hide banner after consent decision
    showBanner = false

    if (!agreed) {
      // @ts-expect-error we dont care about ts here.
      window[`ga-disable-${GA_MEASUREMENT_ID}`] = true
      return
    }

    if (googleAnalyticsScriptLoaded) {
      // console.log("Google Analytics already initialized.")
      return
    }

    interface WindowWithDataLayer extends Window {
      dataLayer?: (Record<string, unknown> | IArguments)[]
      gtag?: (...args: unknown[]) => void
    }

    const _window = window as WindowWithDataLayer
    _window.dataLayer = _window.dataLayer || []
    _window.gtag = function () {
      _window.dataLayer?.push(arguments)
    }

    // 2. Signal that gtag.js is ready (standard practice)
    _window.gtag("js", new Date())

    // 3. Configure Google Analytics (this will be picked up by the script once loaded)
    _window.gtag("config", GA_MEASUREMENT_ID)

    // @ts-expect-error we dont care about ts here.
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = false

    // 4. Create the script element
    const script = document.createElement("script")
    script.id = "google-analytics-script"
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`

    // 5. Set up an onload callback for the script (optional but good for confirmation)
    script.onload = () => {
      googleAnalyticsScriptLoaded = true

      // You can send an additional event here if needed,
      // though the initial 'config' call usually sends a page_view.
      // window.gtag('event', 'analytics_script_loaded_post_consent');
    }

    // 6. Handle potential errors in loading the script
    script.onerror = () => {
      console.error("Failed to load the Google Analytics script.")
      // Potentially remove the predefined gtag and dataLayer if script fails
      // delete window.gtag;
      // delete window.dataLayer;
    }

    // 7. Append the script to the <head> to start loading it
    document.head.appendChild(script)
  }

  const choices = {
    necessary: {
      label: m.cookies_necessary_label(),
      description: m.cookies_necessary_description(),
      value: true,
    },
    tracking: {
      label: m.cookies_tracking_label(),
      description: m.cookies_tracking_description(),
      value: true,
    },
    analytics: {
      label: m.cookies_analytics_label(),
      description: m.cookies_analytics_description(),
      value: true,
    },
    marketing: {
      label: m.cookies_marketing_label(),
      description: m.cookies_marketing_description(),
      value: true,
    },
  }
</script>

{#if showBanner}
  <Banner
    cookieName="funding_finder_cookie_consent"
    description={m.cookies_description()}
    heading={m.cookies_heading()}
    acceptAllLabel={m.cookies_accept_all_label()}
    acceptSelectedLabel={m.cookies_accept_selected_label()}
    rejectLabel={m.cookies_reject_label()}
    settingsLabel={m.cookies_settings_label()}
    closeLabel={m.cookies_close_label()}
    editLabel={m.cookies_edit_label()}
    {choices}
    on:analytics={initAnalytics}
    canRejectCookies={false}
    cookieLifetime={365}
  />
{/if}
