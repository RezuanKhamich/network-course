import { loadConfig } from './config.js';
import { createPool } from './db.js';
import { buildApp } from './app.js';
import { cleanup } from './cleanup.js';

const config = loadConfig();
const pool = createPool(config.databaseUrl);
const app = await buildApp({ config, pool });

const timer = setInterval(() => cleanup(pool).catch(err => app.log.error({ err }, 'уборка не удалась')), 3600e3);
timer.unref();

for (const sig of ['SIGINT', 'SIGTERM']){
  process.once(sig, async () => {
    app.log.info(`${sig}: завершение`);
    await app.close();
    await pool.end();
    process.exit(0);
  });
}

await app.listen({ host: config.host, port: config.port });
