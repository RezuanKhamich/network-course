import { defineConfig } from 'vite';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = import.meta.dirname;
const courses = readdirSync(resolve(root, 'courses'), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

export default defineConfig({
  base: process.env.VITE_BASE || '/',
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
