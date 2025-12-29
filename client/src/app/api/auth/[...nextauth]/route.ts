import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
  interface User {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASEURL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (res.ok && data.accessToken) {
            return {
              id: data.user?.id || credentials.email,
              email: credentials.email,
              name: data.user?.name || credentials.email,
              token: data.accessToken,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASEURL}/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: account.id_token }),
            }
          );

          if (response.ok) {
            const data = await response.json();

            user.accessToken = data.accessToken;
            return true;
          }
          return false;
        } catch (error) {
          console.error("Backend Google Sync Error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.accessToken as string;
      }
      if (user) {
        token.accessToken = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
