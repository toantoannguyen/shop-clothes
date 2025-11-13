import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss"; // <-- 1. IMPORT TAIILWIND

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // <-- 2. THÊM KHỐI LỆNH NÀY
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
