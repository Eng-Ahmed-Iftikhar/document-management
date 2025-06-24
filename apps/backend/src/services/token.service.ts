import * as jwt from 'jsonwebtoken';
import drizzleDb from '../db/drizzle';
import tokenTable, {
  CreateToken,
  UpdateToken,
} from '../db/drizzle/schemas/token.schema';
import { and, eq } from 'drizzle-orm';

export const createToken = (
  payload: object,
  secret: string,
  expiresIn: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(jwt.sign(payload, secret, { expiresIn }));
    } catch (error) {
      reject(error);
    }
  });
};

export const verifyToken = async(token: string, secret: string):Promise< jwt.JwtPayload | undefined> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err);
        reject(err);
      }
    
      resolve(decoded as object);
    });
  });
};

export const decodeToken = (token: string): object | null => {
  return new Promise((resolve, reject) => {
    try {
      resolve(jwt.decode(token, { complete: true })?.payload || null);
    } catch (error) {
      console.error('Token decoding failed:', error);
      reject(error);
    }
  });
};

export const getTokenExpiration = async(token: string) => {
   try {
      const decoded =await decodeToken(token);
      
      
      if (decoded && typeof decoded === 'object' && 'exp' in decoded) {
        return new Date(Number(decoded.exp) * 1000); // Convert seconds to milliseconds
      }
     return null; // If 'exp' is not present, return null
    } catch (error) {
      console.error('Error decoding token:', error);
      return null; // Return null if there's an error decoding the token
    }
};

export const isTokenExpired = async (token: string) => {
  const expirationDate = await getTokenExpiration(token);
  
  if (!expirationDate) return true; // If we can't determine expiration, consider it expired
  return expirationDate < new Date();
};

export const saveToken = async (tokenData: CreateToken) => {
  const [newToken] = await drizzleDb
    .insert(tokenTable)
    .values(tokenData)
    .returning()
    .execute();

  return newToken;
};

export const getTokenByUserId = async (userId: number, type: string) => {
  const token = await drizzleDb
    .select()
    .from(tokenTable)
    .where(
      and(
        eq(tokenTable.user_id, userId),
        eq(tokenTable.type, type),
        eq(tokenTable.status, 'active')
      )
    )
    .limit(1)
    .execute();

  return token[0] || null;
};

export const deleteTokenByUserId = async (userId: number, type: string) => {
  const result = await drizzleDb
    .delete(tokenTable)
    .where(and(eq(tokenTable.user_id, userId), eq(tokenTable.type, type)))
    .execute();

  return result.count > 0; // Returns true if a token was deleted
};

export const deleteTokenById = async (id: number) => {
  const result = await drizzleDb
    .delete(tokenTable)
    .where(eq(tokenTable.id, id))
    .execute();

  return result.count > 0; // Returns true if a token was deleted
};

export const getAllTokens = async () => {
  const tokens = await drizzleDb.select().from(tokenTable).execute();

  return tokens;
};

export const getTokenById = async (id: number) => {
  const token = await drizzleDb
    .select()
    .from(tokenTable)
    .where(eq(tokenTable.id, id))
    .limit(1)
    .execute();

  return token[0] || null;
};

export const updateTokenById = async (id: number, tokenData: UpdateToken) => {
  const [updatedToken] = await drizzleDb
    .update(tokenTable)
    .set(tokenData)
    .where(eq(tokenTable.id, id))
    .returning()
    .execute();

  return updatedToken;
};

export const updateTokenByUserId = async (
  userId: number,
  type: string,
  tokenData: UpdateToken
) => {
  const [updatedToken] = await drizzleDb
    .update(tokenTable)
    .set(tokenData)
    .where(and(eq(tokenTable.user_id, userId), eq(tokenTable.type, type)))
    .returning()
    .execute();
  return updatedToken;
};

export const getTokenByTokenValue = async (tokenValue: string) => {
  const token = await drizzleDb
    .select()
    .from(tokenTable)
    .where(eq(tokenTable.token, tokenValue))
    .limit(1)
    .execute();

  return token[0] || null;
};

export const getTokenByAccessToken = async (accessToken: string) => {
  const token = await drizzleDb
    .select()
    .from(tokenTable)
    .where(
      and(
        eq(tokenTable.access_token, accessToken),
        eq(tokenTable.status, 'active')
      )
    )
    .limit(1)
    .execute();

  return token[0] || null;
};

export const revokeToken = async (userId: number, type: string) => {
  const [revokedToken] = await drizzleDb
    .update(tokenTable)
    .set({ status: 'revoked' })
    .where(and(eq(tokenTable.user_id, userId), eq(tokenTable.type, type)))
    .returning()
    .execute();

  return revokedToken;
};

export const expireToken = async (userId: number, type: string) => {
  const [expiredToken] = await drizzleDb
    .update(tokenTable)
    .set({ status: 'expired' })
    .where(and(eq(tokenTable.user_id, userId), eq(tokenTable.type, type)))
    .returning()
    .execute();

  return expiredToken;
};

export const getActiveTokensByUserId = async (userId: number) => {
  const tokens = await drizzleDb
    .select()
    .from(tokenTable)
    .where(and(eq(tokenTable.user_id, userId), eq(tokenTable.status, 'active')))
    .execute();

  return tokens;
};
