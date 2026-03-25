import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const vitePrerender = require('vite-plugin-prerender');

export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    tailwindcss(),
    command === 'build'
      ? vitePrerender({
          staticDir: path.join(__dirname, 'dist'),
          routes: ['/', '/about', '/contact'],
        })
      : null,
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
}));
