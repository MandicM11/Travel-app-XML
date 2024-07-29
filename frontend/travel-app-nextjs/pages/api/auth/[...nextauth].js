import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { useRouter } from 'next/router';   

import { useSession } from 'next-auth/react';

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Your login logic here, including fetching user data from your backend
        const res = await fetch('http://localhost:8001/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const   
 user = await res.json();

        if (res.ok && user) {
          return user;
        } else   
 {
          throw new Error(user.error || 'Invalid credentials');
        }
      },
    }),
  ],
  callbacks: {
    // Optional callbacks for additional customization
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  secret: '12345', // Replace with a secure secret
});