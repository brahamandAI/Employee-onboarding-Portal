import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/lib/auth/auth.config";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { verifyPassword } from "@/lib/auth/password";
import { isStaffRole } from "@/lib/auth/permissions";
import {
  MAX_LOGIN_ATTEMPTS,
  ACCOUNT_LOCK_MINUTES,
} from "@/types/enums";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        await connectDB();

        const user = await User.findOne({ email });

        if (!user || !user.isActive) {
          return null;
        }

        if (!isStaffRole(user.role)) {
          return null;
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error("Account is temporarily locked. Try again later.");
        }

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
          user.failedLoginAttempts += 1;

          if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
            user.lockedUntil = new Date(
              Date.now() + ACCOUNT_LOCK_MINUTES * 60 * 1000
            );
            user.failedLoginAttempts = 0;
          }

          await user.save();
          return null;
        }

        user.failedLoginAttempts = 0;
        user.lockedUntil = undefined;
        user.lastLoginAt = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
