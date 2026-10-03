import path from "path"
// @ts-expect-error Build-only JavaScript plugin.
import { blogContentPlugin } from "./scripts/blog-content.mjs"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    blogContentPlugin(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false, // using our own public/manifest.json
      workbox: {
        // Raise default 2 MiB precache limit to allow current main bundle.
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallbackDenylist: [/^\/blog(?:\/|$)/],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  base: '/', // Default is fine for Vercel
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
