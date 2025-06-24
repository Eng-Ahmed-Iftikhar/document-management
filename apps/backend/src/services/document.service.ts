import { and, eq } from 'drizzle-orm';
import drizzleDb from '../db/drizzle';
import documentTable, { Document } from '../db/drizzle/schemas/document.schema';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import env from '../config/env';
import supabaseClient from '../config/supabase';
import { File } from '../types/document';

export const createDocument = async (document: Document) => {
  const newDocument = await drizzleDb
    .insert(documentTable)
    .values(document)
    .returning()
    .execute();
  return newDocument[0];
};

export const getDocuments = async () => {
  const documents = await drizzleDb.select().from(documentTable).execute();
  return documents;
};

export const getUserDocumentById = async (id: number, userId: number) => {
  console.log({ id, userId });
  const [document] = await drizzleDb
    .select()
    .from(documentTable)
    .where(and(eq(documentTable.id, id), eq(documentTable.user_id, userId)))
    .execute();
  return document;
};

export const uploadDocument = async (file: File) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/octet-stream',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds 10MB');
  }

  const fileExt = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExt}`;
  const bucket = env.supabase.bucketName;
  // Upload file to Supabase
  const { error: uploadError } = await supabaseClient.storage
    .from(bucket)
    .upload(`docs/${fileName}`, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabaseClient.storage
    .from(bucket)
    .getPublicUrl(`docs/${fileName}`);
  return publicUrlData.publicUrl;
};

export const updateUserDocumentById = async (
  userId: number,
  id: number,
  document: Document
) => {
  const updatedDocument = await drizzleDb
    .update(documentTable)
    .set(document)
    .where(and(eq(documentTable.id, id), eq(documentTable.user_id, userId)))
    .returning()
    .execute();
  return updatedDocument[0];
};

export const deleteUserDocumentById = async (id: number, userId: number) => {
  return await drizzleDb
    .delete(documentTable)
    .where(and(eq(documentTable.id, id), eq(documentTable.user_id, userId)))
    .returning()
    .execute();
};

export const getDocumentsByUserId = async (userId: number) => {
  const documents = await drizzleDb
    .select()
    .from(documentTable)
    .where(eq(documentTable.user_id, userId))
    .execute();
  return documents;
};

export const getDocumentsCountByUserId = async (userId: number) => {
  const documents = await drizzleDb
    .select()
    .from(documentTable)
    .where(eq(documentTable.user_id, userId))
    .execute();
  return documents.length;
};

export const getPaginatedUserDocuments = async (
  page: number,
  limit: number,
  userId: number
) => {
  const documents = await drizzleDb
    .select()
    .from(documentTable)
    .where(eq(documentTable.user_id, userId))
    .limit(limit)
    .offset((page - 1) * limit)
    .execute();
  return documents;
};
