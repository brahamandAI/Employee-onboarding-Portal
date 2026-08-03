import type { NextAuthConfig } from "next-auth";
import { UserRole } from "@/types/enums";

export const authConfig: NextAuthConfig = {
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
    updateAge: 60 * 60,
  },
  pages: {
    signIn: "/staff/login",
    error: "/staff/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as typeof UserRole.L1;
      }
      return session;
    },
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      if (pathname.startsWith("/dashboard")) {
        return !!auth?.user;
      }
      return true;
    },
  },
  trustHost: true,
};
