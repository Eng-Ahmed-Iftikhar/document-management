import { Strategy as BearerStrategy } from 'passport-http-bearer';
import drizzleDb from '../db/drizzle';
import userTable from '../db/drizzle/schemas/user.schema';
import { and, eq } from 'drizzle-orm';
import { tokenService } from '../services';

export const bearerStrategy = new BearerStrategy(async (jwt_payload, done) => {
  try {
    const decodedtoken = (await tokenService.decodeToken(jwt_payload)) as {
      userId: number;
    };

    const isExpired = await tokenService.isTokenExpired(jwt_payload);

    if (isExpired) return done(null, false);

    const user = await drizzleDb
      .select()
      .from(userTable)
      .where(
        and(
          eq(userTable.id, decodedtoken?.userId),
          eq(userTable.is_active, true)
        )
      )
      .limit(1)
      .execute();
    if (user[0]) return done(null, user[0].id);
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
});
