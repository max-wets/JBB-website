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
        console.log("req:", req.body);

        const reqBody = {
          identifier: credentials.email,
          password: credentials.password,
        };

        console.log("req body:", reqBody);

        const res = await fetch("https://strapi-d6ef.onrender.com/auth/local", {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();
        console.log("back end user:", user);

        if (res.ok && user) {
          return user;
        }

        return null;
      },
    }),
  ],
  //   pages: {
  //     signIn: "/auth/credentials-sign",
  //   },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true,
};

export default (req, res) => NextAuth(req, res, options);
