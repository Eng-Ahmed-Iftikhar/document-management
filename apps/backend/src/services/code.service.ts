import { and, eq } from 'drizzle-orm';
import drizzleDb from '../db/drizzle';
import codeTable, {
  CreateCode,
  UpdateCode,
} from '../db/drizzle/schemas/code.schema';

export const createCode = async (code: CreateCode) => {
  const newCode = await drizzleDb
    .insert(codeTable)
    .values(code)
    .returning()
    .execute();

  return newCode[0];
};

export const getCodeById = async (id: number) => {
  const code = await drizzleDb
    .select()
    .from(codeTable)
    .where(eq(codeTable.id, id))
    .execute();

  return code[0];
};

export const getCodeByUserId = async (userId: number) => {
  const code = await drizzleDb
    .select()
    .from(codeTable)
    .where(eq(codeTable.user_id, userId))
    .execute();

  return code[0];
};

export const getCodeByCode = async (code: string) => {
  const codeData = await drizzleDb
    .select()
    .from(codeTable)
    .where(and(eq(codeTable.code, code), eq(codeTable.status, 'active')))
    .execute();
  return codeData[0];
};

export const deleteCodeById = async (id: number) => {
  await drizzleDb.delete(codeTable).where(eq(codeTable.id, id)).execute();
  return true;
};

export const deleteCodeByUserId = async (userId: number) => {
  await drizzleDb
    .delete(codeTable)
    .where(eq(codeTable.user_id, userId))
    .execute();
  return true;
};

export const updateCode = async (id: number, code: UpdateCode) => {
  const updatedCode = await drizzleDb
    .update(codeTable)
    .set(code)
    .where(eq(codeTable.id, id))
    .returning()
    .execute();

  return updatedCode[0];
};

export const isCodeExpired = async (code: string) => {
  const codeData = await drizzleDb
    .select()
    .from(codeTable)
    .where(eq(codeTable.code, code))
    .execute();

  return codeData[0].expires_at < new Date();
};
