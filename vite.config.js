import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 👈 yeh line missing thi
  ],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
