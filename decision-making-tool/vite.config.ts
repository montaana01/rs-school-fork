import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  server: {
    port: 8080,
    open: true,
  },
  build: {
    target: 'ESNext',
    outDir: 'dist',
    sourcemap: true,
  },
});
