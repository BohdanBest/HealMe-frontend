import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Це каже Vite: "коли бачиш @, шукай у папці src"
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Налаштування CSS Preprocessor (якщо будуть проблеми з SCSS)
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
});
