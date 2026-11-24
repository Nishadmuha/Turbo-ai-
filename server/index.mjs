import { connectDatabase } from './db.mjs';
import { createApp } from './app.mjs';

const { db, client } = await connectDatabase();
const origins = (process.env.CMS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173').split(',').map(value => value.trim());
const app = await createApp({ db, origins });
const port = Number(process.env.CMS_PORT || 4100);
const server = app.listen(port, process.env.CMS_HOST || '127.0.0.1', () => console.log(`MongoDB CMS API ready at http://127.0.0.1:${port}/api/cms/health`));
async function stop() { server.close(); await client.close(); process.exit(0); }
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
