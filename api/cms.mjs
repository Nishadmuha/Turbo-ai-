import { createServerlessHandler } from '../server/serverless.mjs';

// One cached database pool and Express application per warm Vercel function instance.
export default createServerlessHandler();
