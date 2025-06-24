import { integer, pgTable, varchar,timestamp ,boolean} from "drizzle-orm/pg-core";

 const userTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 50 }).notNull().unique(),
  email: varchar({ length: 100 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
  is_active: boolean().notNull().default(true),
  is_verified:boolean().notNull().default(false),
  role: varchar({ length: 20 }).notNull().default("user"),
  last_login: timestamp().notNull().defaultNow(),
});


export default userTable;

export type User = typeof userTable.$inferSelect;
export type CreateUser = typeof userTable.$inferInsert;
export type UpdateUser =  Partial<User>;
