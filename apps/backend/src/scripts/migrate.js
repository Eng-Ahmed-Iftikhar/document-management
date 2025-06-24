// scripts/migrate.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({
    path:
        process.env.NODE_ENV === "development"
            ? ".env.producion"
            : ".env.development",
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
  console.log('⏳ Running migrations...');
  await migrate(db, { migrationsFolder: 'D:/Projects/document-management/apps/backend/src/db/drizzle/migrations' });
  console.log('✅ Migrations complete!');
  await pool.end();
}

main().catch((err) => {
  console.error('❌ Migration failed:',err);
  process.exit(1);
});
