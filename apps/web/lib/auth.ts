import NextAuth, { type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@pharma/shared';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      sendVerificationRequest({ identifier, url }) {
        console.log('Magic link request', identifier, url);
      },
      from: process.env.EMAIL_FROM ?? 'noreply@example.com',
    }),
  ],
  session: { strategy: 'database' },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
