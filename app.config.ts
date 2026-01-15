import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: false,
  vite: {
    resolve: {
      alias: {
        "~": "/src",
        "@": "/src",
      },
    },
  },
});
