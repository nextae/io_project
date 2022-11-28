import { defineConfig } from "vite";
import postcssNested from "postcss-nested";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  css: {
    postcss: {
      plugins: [postcssNested],
    }
  }
});
