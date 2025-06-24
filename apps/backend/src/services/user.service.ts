import { sql ,eq} from "drizzle-orm";
import drizzleDb from "../db/drizzle";
import userTable, { CreateUser, UpdateUser } from "../db/drizzle/schemas/user.schema";

export const getUserByEmail = async (email: string) => {
    const user = await drizzleDb
        .select()
        .from(userTable)
        .where(sql`lower(${userTable.email}) = lower(${email})`)
        .limit(1)
        .execute();
    
    return user[0] || null;
}

export const getUserById = async (id: number) => {
    const user = await drizzleDb
        .select()
        .from(userTable)
        .where(eq(userTable.id, id))
        .limit(1)
        .execute();
    
    return user[0] || null;
}

export const createUser = async (userData: CreateUser) => {
    const [newUser] = await drizzleDb
        .insert(userTable)
        .values(userData)
        .returning()
        .execute();
    
    return newUser;
}

export const updateUser = async (id: number, userData: UpdateUser) => {
    const [updatedUser] = await drizzleDb
        .update(userTable)
        .set(userData)
        .where(eq(userTable.id, id))
        .returning()
        .execute();
    
    return updatedUser;
}

export const deleteUser = async (id: number) => {
    const result = await drizzleDb
        .delete(userTable)
        .where(eq(userTable.id, id))
        .execute();
    
    return result.count > 0; // Returns true if a user was deleted
}

export const getAllUsers = async () => {
    const users = await drizzleDb
        .select()
        .from(userTable)
        .execute();
    
    return users;
}

export const getUserByUsername = async (username: string) => {
    const user = await drizzleDb
        .select()
        .from(userTable)
        .where(sql`lower(${userTable.username}) = lower(${username})`)
        .limit(1)
        .execute();
    
    return user[0] || null;
}

export const getAllUsersWithPagination = async (page: number, limit: number) => {

    const offset = (page - 1) * limit;
    
    const users = await drizzleDb
        .select()
        .from(userTable)
        .limit(limit)
        .offset(offset)
        .execute();
    
    return users;
}