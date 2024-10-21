import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db/db";
import { compare } from "bcrypt";

const credentialsConfig = CredentialsProvider({
  id: "credentials",
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials): Promise<any> {
    if (!credentials?.email || !credentials?.password) {
      throw new Error("Missing email or password");
    }

    const user = await db.user.findUnique({
      where: { email: credentials.email as string },
    });

    if (!user) {
      throw new Error("No user found with the provided email");
    }

    const isPasswordValid = await compare(
      credentials.password.toString(),
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return {
      id: user.id,
      name: user.username,
      email: user.email,
    };
  },
});

const config = {
  providers: [credentialsConfig],
  callbacks: {
    jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
