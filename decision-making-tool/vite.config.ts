import { defineConfig } from 'vite';
import sassDts from 'vite-plugin-sass-dts';

export default defineConfig({
  plugins: [sassDts()],
  server: {
    port: 8080,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
