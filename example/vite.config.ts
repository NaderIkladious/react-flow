import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const repoBase = "react-flow";

const isCustomDomain = process.env.CUSTOM_DOMAIN === "true";

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        docsConditional: resolve(__dirname, "docs/conditional/index.html"),
        docsForEach: resolve(__dirname, "docs/foreach/index.html"),
        docsSwitch: resolve(__dirname, "docs/switch/index.html"),
        docsBatch: resolve(__dirname, "docs/batch/index.html"),
      },
    },
  },
});
