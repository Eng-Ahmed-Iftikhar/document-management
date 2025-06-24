import { eq } from "drizzle-orm";
import drizzleDb from "../db/drizzle";
import profileTable, { CreateProfile } from "../db/drizzle/schemas/profile.schema";

export const createProfile=async(Profile:CreateProfile)=>{
    const newProfile=await drizzleDb
        .insert(profileTable)
        .values(Profile).returning()
        .execute();

    return newProfile[0];
}

export const getProfileByUserId = async (userId: number) => {
    const profile = await drizzleDb
        .select()
        .from(profileTable)
        .where(eq(profileTable.user_id, userId))
        .limit(1)
        .execute();

    return profile[0] || null;
}
export const updateProfileByUserId = async (userId: number, profileData: Partial<CreateProfile>) => {
    const [updatedProfile] = await drizzleDb
        .update(profileTable)
        .set(profileData)
        .where(eq(profileTable.user_id, userId))
        .returning()
        .execute();

    return updatedProfile;
}

export const deleteProfileByUserId = async (userId: number) => {
    const result = await drizzleDb
        .delete(profileTable)
        .where(eq(profileTable.user_id, userId))
        .execute();

    return result.count > 0; // Returns true if a profile was deleted
}

export const getAllProfiles = async () => {
    const profiles = await drizzleDb
        .select()
        .from(profileTable)
        .execute();

    return profiles;
}

export const getProfileById= async(id:number)=>{
    return drizzleDb
        .select()
        .from(profileTable)
        .where(eq(profileTable.id, id))
        .limit(1)
        .execute()
        .then(profiles => profiles[0] || null);
}

export const updateProfileById = async (id: number, profileData: Partial<CreateProfile>) => {
    const [updatedProfile] = await drizzleDb
        .update(profileTable)
        .set(profileData)
        .where(eq(profileTable.id, id))
        .returning()
        .execute();

    return updatedProfile;
}

export const deleteProfileById = async (id: number) => {
    const result = await drizzleDb
        .delete(profileTable)
        .where(eq(profileTable.id, id))
        .execute();

    return result.count > 0; // Returns true if a profile was deleted
}