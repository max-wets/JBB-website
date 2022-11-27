import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";

const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        // console.log("req:", req.body);

        const reqBody = {
          identifier: credentials.email,
          password: credentials.password,
        };

        // console.log("req body:", reqBody);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/local`,
          {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();

        if (!res.ok) {
          // console.log("res not ok");
          // throw new Error(user.exception);
          return user.exception;
        }
        // If no error and we have user data, return it
        if (res.ok && user) {
          // console.log("res ok");
          return user;
        }

        // console.log("res null");
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
        // console.log("token:", token);
        // console.log("user:", user);
        // console.log("account:", account);

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
      session.user.accessToken = token.accessToken;
      session.user.id = token.id;
      // console.log("session:", session);

      return session;
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
