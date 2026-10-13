import { defineConfig } from 'vite';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = import.meta.dirname;
const courses = readdirSync(resolve(root, 'courses'), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  // в разработке API на том же origin, что и сайт, как на продакшене за nginx: cookie и проверка Origin работают одинаково
  server: { proxy: { '/api': 'http://127.0.0.1:3000' } },
  preview: { proxy: { '/api': 'http://127.0.0.1:3000' } },
  build: {
    // чанк курса — это текст всех уроков, он грузится одним куском на странице курса
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        ...Object.fromEntries(courses.map(id => [id, resolve(root, 'courses', id, 'index.html')]))
      }
    }
  }
});
