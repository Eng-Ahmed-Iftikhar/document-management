import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import userTable from './user.schema';

const documentTable = pgTable('documents', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  summary: varchar({ length: 255 }),
  url: varchar({ length: 255 }).notNull(),
  status: varchar({ length: 255 }).notNull().default('active'),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export default documentTable;

export type Document = typeof documentTable.$inferSelect;
export type CreateDocument = typeof documentTable.$inferInsert;
export type UpdateDocument = Partial<CreateDocument>;
