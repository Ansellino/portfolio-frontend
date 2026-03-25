import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const vitePrerender = require('vite-plugin-prerender');

export default defineConfig(({ command }) => {
  // The prerender plugin depends on an old Puppeteer Chromium build
  // that fails in Vercel's Linux image (missing shared libs like libnss3).
  // Keep prerender for local builds, skip it on Vercel/CI deployments.
  const shouldPrerender = command === 'build' && !process.env.VERCEL;

  return {
    plugins: [
      vue(),
      tailwindcss(),
      shouldPrerender
        ? vitePrerender({
            staticDir: path.join(__dirname, 'dist'),
            routes: ['/', '/about', '/contact'],
          })
        : null,
    ],
    resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  };
});
