import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import adapterAuto from "@sveltejs/adapter-auto"
import adapterNode from "@sveltejs/adapter-node"

// Determine which adapter to use
const isNodeTarget = process.env.DEPLOY_TARGET === "NODE"
const websiteBaseUrl =
  process.env.PUBLIC_WEBSITE_BASE_URL || "https://www.grantzilla.org"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: isNodeTarget ? adapterNode() : adapterAuto(),
    // allow up to 150kb of style to be inlined with the HTML
    // Faster FCP (First Contentful Paint) by reducing the number of requests
    inlineStyleThreshold: 150000,
    paths: {
      base: "",
      relative: false,
    },
    alias: {
      $src: "src/",
    },
    prerender: {
      origin: websiteBaseUrl,
    },
  },
  preprocess: vitePreprocess(),
}

export default config
