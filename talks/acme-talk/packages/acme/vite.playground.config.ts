import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static build of the playground (index.html + src/playground.tsx) for the portfolio site.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: 'dist/playground', emptyOutDir: true },
});
