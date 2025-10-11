import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    historyApiFallback: true,
    host: 'localhost',
    port: 5173,
    hmr: true, // Let Vite handle port allocation dynamically
    watch: {
      usePolling: true
    }
  },
  preview: {
    port: 3000,
    host: true,
  },
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/context": path.resolve(__dirname, "./src/context"),
      "@/hooks": path.resolve(__dirname, "./src/hooks")
    },
  },
});
