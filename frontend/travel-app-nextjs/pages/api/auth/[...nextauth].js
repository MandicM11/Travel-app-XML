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
            console.log('Set-Cookie Header:', response.headers['set-cookie'][0]); // Logovanje celog set-cookie headera

            const cookieValue = response.headers['set-cookie'][0];
            const token = cookieValue.split(';')[0].split('=')[1];
            console.log('Ovo je splitovani izvuceni Token:', token); // Logovanje izvučenog tokena

            return {
              id: user.id,
              email: user.email,
              accessToken: token, // Preuzmite JWT iz kolačića
            };
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
        token.accessToken = user.accessToken; // Dodajte JWT token u korisnički token
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
  // cookies: {
  //   sessionToken: {
  //     name: 'session-token',
  //     options: {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //       sameSite: 'lax',
  //       path: '/',
  //     },
  //   },
  // },
});