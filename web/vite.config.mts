import path from "node:path"

import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [TanStackRouterVite(), react({ include: "**/*.tsx" }), tsconfigPaths()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./") },
  },
})
