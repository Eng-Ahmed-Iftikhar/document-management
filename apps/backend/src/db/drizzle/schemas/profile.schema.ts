import { integer, pgTable, varchar,timestamp } from "drizzle-orm/pg-core";
import userTable from "./user.schema";

 const profileTable = pgTable('profiles', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer().notNull().references(() => userTable.id, { onDelete: 'cascade' }),
    bio: varchar({ length: 500 }),
    profile_img: varchar({ length: 255 }),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
    first_name: varchar({ length: 100 }).notNull(),
    last_name: varchar({ length: 100 }).notNull(),
});


export default profileTable;

export type Profile = typeof profileTable.$inferSelect;
export type CreateProfile = typeof profileTable.$inferInsert;
export type UpdateProfile = Partial<Profile>;