import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';

const SECRET_KEY = '12345'; // Koristi isti tajni ključ kao na backendu

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const res = await fetch('http://localhost:8001/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const user = await res.json();
        console.log('User from backend:', user); // Dodaj log ovde

        if (res.ok && user) {
          return user;
        } else {
          throw new Error(user.error || 'Invalid credentials');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.token; // Dodaj token ovde
      }
      console.log('JWT Token:', token); // Dodaj ovu liniju
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        role: token.role,
        token: token.accessToken, // Dodaj token ovde
      };
      console.log('Session Data:', session); // Dodaj ovu liniju
      return session;
    },
  },
  secret: SECRET_KEY,
  pages: {
    signIn: '/login',
  },
});
