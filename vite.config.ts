import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias '@' apontando para a pasta src do client
      "@": path.resolve(__dirname, "src")
    }
  },
  build: {
    rollupOptions: {
      // Se houver módulos externos que queira ignorar, pode adicionar aqui
      external: []
    }
  }
});
