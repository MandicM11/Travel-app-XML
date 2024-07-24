import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginUser } from '../../../services/api';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                try {
                    const user = await loginUser(credentials);
                    if (user) {
                        return user;
                    } else {
                        return null;
                    }
                } catch (error) {
                    throw new Error('Invalid credentials');
                }
            }
        })
    ],
    secret: '12345',
    session: {
        strategy: 'jwt', // Koristite JWT za sesije
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        }
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // koristi secure samo u produkciji
                sameSite: 'lax',
                path: '/',
            }
        }
    }
});
