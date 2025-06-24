import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import userTable from './user.schema';

const codeTable = pgTable('codes', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  code: varchar({ length: 255 }).notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
  status: varchar({ length: 255 }).notNull().default('active'),
  expires_at: timestamp().notNull(),
  type: varchar({ length: 255 }).notNull(),
});

export default codeTable;

export type Code = typeof codeTable.$inferSelect;
export type CreateCode = typeof codeTable.$inferInsert;
export type UpdateCode = Partial<CreateCode>;
