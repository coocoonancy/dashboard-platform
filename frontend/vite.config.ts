import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      "/data": "http://localhost:3000",
      "/api": "http://localhost:3000",
    },
  },
});
