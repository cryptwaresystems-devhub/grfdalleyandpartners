import { assertProductionPrivacy } from './src/lib/privacy';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [{ name: 'privacy-production-launch-check', configResolved(config) { if (config.command === 'build' && (process.env.VERCEL_ENV === 'production' || (process.env.SITE_DEPLOYMENT_TARGET ?? loadEnv(config.mode, process.cwd(), 'SITE_').SITE_DEPLOYMENT_TARGET) === 'production' || config.mode === 'production-release')) assertProductionPrivacy(); } }, react(), tailwindcss()],
  // Keep framework code cacheable when structured site content changes.
  build: { rollupOptions: { output: { manualChunks: id => /[\\/]node_modules[\\/]/.test(id) ? 'vendor' : undefined } } },
  // Windows may lock source-review documents while they are downloaded/read.
  // These non-app folders must not participate in hot reload.
  server: { watch: { ignored: ['**/tmp/**', '**/.review-deps/**', '**/.qodo/**'] } },
});
