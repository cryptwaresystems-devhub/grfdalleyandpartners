import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Keep framework code cacheable when structured site content changes.
  build: { rollupOptions: { output: { manualChunks: id => /[\\/]node_modules[\\/]/.test(id) ? 'vendor' : undefined } } },
  // Windows may lock source-review documents while they are downloaded/read.
  // These non-app folders must not participate in hot reload.
  server: { watch: { ignored: ['**/tmp/**', '**/.review-deps/**', '**/.qodo/**'] } },
});
