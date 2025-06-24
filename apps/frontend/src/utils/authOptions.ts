import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'utils/axios';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET_KEY,
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        email: {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Enter Email',
        },
        password: {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'Enter Password',
        },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post('/auth/login', {
            password: credentials?.password,
            email: credentials?.email,
          });
          console.log('response', response);
          const user = response.data.data.user;

          if (user) {
            user['accessToken'] = response.data.data.accessToken;
            user['expireIn'] = response.data.data['expireIn'];

            user['name'] =
              user.profile.first_name + ' ' + user.profile.last_name;
            return user;
          }
        } catch (e: any) {
          const errorMessage = e.message || e?.response.data.message;
          throw new Error(errorMessage);
        }
      },
    }),
    CredentialsProvider({
      id: 'register',
      name: 'Register',
      credentials: {
        first_name: {
          name: 'first_name',
          label: 'Firstname',
          type: 'text',
          placeholder: 'Enter Firstname',
        },
        last_name: {
          name: 'last_name',
          label: 'Lastname',
          type: 'text',
          placeholder: 'Enter Lastname',
        },
        email: {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Enter Email',
        },
        username: {
          name: 'username',
          label: 'Username',
          type: 'text',
          placeholder: 'Enter username',
        },
        password: {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'Enter Password',
        },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post('/auth/register', {
            first_name: credentials?.first_name,
            last_name: credentials?.last_name,
            username: credentials?.username,
            password: credentials?.password,
            email: credentials?.email,
          });
          const user = response.data.data.user;
          user['accessToken'] = response.data.data.accessToken;
          user['expireIn'] = response.data.data['expireIn'];

          user['name'] = user.profile.first_name + ' ' + user.profile.last_name;
          if (user) {
            return user;
          }
        } catch (e: any) {
          console.log('E', e);

          const errorMessage = e?.response.data.message;
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      const newToken = token;
      // @ts-ignore
      const access_token = user?.accessToken || token?.accessToken;
      // @ts-ignore
      const expireIn = user?.expireIn || token?.expireIn;

      if (user) {
        // @ts-ignore
        newToken.accessToken = user.accessToken;
        newToken.id = user.id;
        newToken.provider = account?.provider;
        // @ts-ignore
        newToken.expireIn = user.expireIn;
      }
      if (access_token && Date.now() > new Date(expireIn).getTime()) {
        const response = await axios.post('/auth/refresh-token', {
          access_token,
        });
        newToken.accessToken = response.data.data.accessToken;
        newToken.expireIn = response.data.data['expireIn'];
        newToken.id = user.id;
        newToken.provider = account?.provider;
      }

      return newToken;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.provider = token.provider;
        session.token = token;

        // @ts-ignore
        const access_token = token?.accessToken;
        // @ts-ignore
        const expireIn = token?.expireIn as number;

        if (access_token && Date.now() > new Date(expireIn).getTime()) {
          const response = await axios.post('/auth/refresh-token', {
            access_token,
          });
          token.accessToken = response.data.data.accessToken;
          token.expireIn = response.data.data['expireIn'];
          session.token = token;
        }
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.NEXT_APP_JWT_TIMEOUT!),
  },
  jwt: {
    secret: process.env.NEXT_APP_JWT_SECRET,
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/login',
  },
};
