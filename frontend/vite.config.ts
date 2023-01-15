/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import postcssNested from "postcss-nested";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  css: {
    postcss: {
      plugins: [postcssNested],
    },
  },
  test: {
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache", "e2e"],
    environment: "jsdom",
    globals: true,
    coverage: {
      reporter: ["lcov"],
    },
  },
});
