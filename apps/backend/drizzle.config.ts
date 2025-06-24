import { defineConfig } from 'drizzle-kit';
import env from './src/config/env';
console.log({ env });

export default defineConfig({
  out: './src/db/drizzle/migrations',
  schema: './src/db/drizzle/schemas/**/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.databaseUrl as string,
    ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
  },
});
