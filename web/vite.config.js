import { defineConfig } from 'vite';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = import.meta.dirname;
// заголовки безопасности продакшена (CSP и др.) — из конфига nginx, чтобы preview ловил нарушения до выкладки
const securityHeaders = Object.fromEntries(
  [...readFileSync(resolve(root, '../deploy/nginx/security-headers.conf'), 'utf8').matchAll(/^add_header (\S+) "(.*)" always;\s*$/gm)].map(m => [m[1], m[2]])
);
const courses = readdirSync(resolve(root, 'courses'), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  // в разработке API на том же origin, что и сайт, как на продакшене за nginx: cookie и проверка Origin работают одинаково
  server: { proxy: { '/api': 'http://127.0.0.1:3000' } },
  preview: { proxy: { '/api': 'http://127.0.0.1:3000' }, headers: securityHeaders },
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
