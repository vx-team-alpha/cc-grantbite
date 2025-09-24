import { paraglideVitePlugin } from "@inlang/paraglide-js"
import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vitest/config"
import { buildAndCacheSearchIndex } from "./src/lib/build_index"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    // mkcert(),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide",
      strategy: ["url", "localStorage", "preferredLanguage", "baseLocale"],
      disableAsyncLocalStorage: true,
      urlPatterns: [
        {
          pattern: "/:path(.*)?",
          localized: [
            ["de", "/de/:path(.*)?"],
            ["es", "/es/:path(.*)?"],
            ["fr", "/fr/:path(.*)?"],
            ["pt", "/pt/:path(.*)?"],
            ["en", "/en/:path(.*)?"],
          ],
        },
      ],
    }),
    tailwindcss(),
    sveltekit(),
    {
      name: "vite-build-search-index",
      writeBundle: {
        order: "post",
        sequential: false,
        handler: async () => {
          console.log("Building search index...")
          await buildAndCacheSearchIndex()
        },
      },
    },
  ],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    globals: true, /// allows to skip import of test functions like `describe`, `it`, `expect`, etc.
  },
})
