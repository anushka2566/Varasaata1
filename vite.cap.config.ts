import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// Capacitor-specific Vite config: client-only SPA build (no SSR/Nitro)
export default defineConfig({
  plugins: [tailwindcss(), react(), tsconfigPaths()],
  define: {
    // Stub out server-only globals so the client bundle doesn't break
    "process.env": {},
  },
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
    // Disable CSS minification — Tailwind v4 source() syntax not yet
    // supported by the bundled lightningcss minifier in this Vite version.
    cssMinify: false,
    rollupOptions: {
      input: { index: resolve(__dirname, "index.cap.html") },
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
