import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { AuthOptions, DefaultSession } from "next-auth";
import { SessionUser } from "../../../types";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      accessToken: string;
    } & DefaultSession["user"];
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface User extends SessionUser {}
}

declare module "next-auth/jwt" {
  export interface JWT extends Record<string, unknown>, DefaultJWT {
    id: number;
    name: string;
    email: string;
    accessToken: string;
    iat: number;
    exp: number;
    jti: string;
  }
}

const options: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async authorize(credentials, _req) {
        const reqBody = {
          identifier: credentials!.email,
          password: credentials!.password,
        };

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/local`,
          {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!res.ok) {
          throw new Error("Sign-in failed: wrong or missing credentials");
        }
        // If no error and we have user data, return it
        const user = await res.json();
        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/auth/signin",
    // error: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          id: user.user.id,
          name: user.user.username,
          email: user.user.email,
          accessToken: user.jwt,
        };
      }

      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          accessToken: token.accessToken,
        },
      };
    },
  },
};

const nextAuthMiddleware = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);

export default nextAuthMiddleware;
