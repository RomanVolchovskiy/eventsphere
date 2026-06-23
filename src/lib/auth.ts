import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { rateLimit } from "./ratelimit";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
    };
    googleAccessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    googleAccessToken?: string;
    googleRefreshToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.events",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Rate limit: 10 login attempts per email per 15 minutes
        const rl = rateLimit(
          `login:${credentials.email.toLowerCase()}`,
          10,
          15 * 60 * 1000
        );

        if (!rl.success) {
          throw new Error("Забагато спроб входу. Спробуйте через 15 хвилин.");
        }

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { getDb } = require("./db");
        const db = getDb();

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Google sign-in
      if (account?.provider === "google") {
        token.googleAccessToken = account.access_token;
        token.googleRefreshToken = account.refresh_token;

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { getDb } = require("./db");
        const db = getDb();
        let dbUser = await db.user.findUnique({ where: { email: token.email! } });
        if (!dbUser) {
          dbUser = await db.user.create({
            data: {
              email: token.email!,
              name: token.name ?? null,
              role: "CLIENT",
            },
          });
        }
        token.id = dbUser.id;
        token.role = dbUser.role;
      }

      // Credentials sign-in
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "CLIENT";
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      if (token.googleAccessToken) {
        session.googleAccessToken = token.googleAccessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
