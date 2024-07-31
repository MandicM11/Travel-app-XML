import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;
console.log('NextAuth JWT Secret:', jwtSecret);

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user-service/login`, {
            email: credentials.email,
            password: credentials.password,
          }, { withCredentials: true });

          const user = response.data;

          if (user && response.headers['set-cookie']) {
            return { id: user.id, email: user.email };
          } else {
            return null;
          }
        } catch (error) {
          console.error('Error during login:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: jwtSecret,
    signingOptions: {
      algorithm: 'HS256',
    },
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      console.log('JWT Callback Token:', token);
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token;
      console.log('Session Callback:', session);
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  cookies: {
    sessionToken: {
      name: 'session-token',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      },
    },
  },
});
