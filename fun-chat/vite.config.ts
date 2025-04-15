import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
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
