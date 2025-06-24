

import { integer, pgTable, varchar,timestamp } from "drizzle-orm/pg-core";
import userTable from "./user.schema";


 const tokenTable = pgTable("tokens", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer().notNull().references(() => userTable.id, { onDelete: 'cascade' }),
    token: varchar({ length: 255 }).notNull(),
    access_token: varchar({ length: 255 }), // Optional, used for access tokens
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
    expires_at: timestamp().notNull(),
    type: varchar({ length: 50 }).notNull(), // e.g., 'access', 'refresh', 'verification'
    status: varchar({ length: 50 }).notNull().default('active'), // e.g., 'active', 'revoked', 'expired'
});


export default tokenTable;

export type Token = typeof tokenTable.$inferSelect;
export type CreateToken = typeof tokenTable.$inferInsert;
export type UpdateToken = Partial<Token>;
export type TokenType = 'access' | 'refresh' | 'verification';
export type TokenStatus = 'active' | 'revoked' | 'expired';

