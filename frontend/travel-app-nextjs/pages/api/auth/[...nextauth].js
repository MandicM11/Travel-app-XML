import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

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
          const response = await axios.post('http://localhost:8000/user-service', {
            email: credentials.email,
            password: credentials.password,
          });

          const user = response.data;

          if (user && user.token) {
            return { id: user.id, email: user.email, accessToken: user.token }; // Pretpostavljamo da 'token' sadrži JWT
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
    jwt: true,
  },
  jwt: {
    secret: '12345', // Koristi varijablu okruženja
    signingOptions: {
      algorithm: 'HS256',
    },
  },
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session(session, token) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
