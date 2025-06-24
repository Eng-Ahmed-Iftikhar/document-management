
import { drizzle } from 'drizzle-orm/postgres-js'
import  postgres from "postgres"
import env from '../../config/env';


// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(env.databaseUrl, { prepare: false })
const drizzleDb = drizzle(client);

export default drizzleDb