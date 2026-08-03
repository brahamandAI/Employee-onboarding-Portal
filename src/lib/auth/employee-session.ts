import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import {
  EmployeeSessionPayload,
  PasswordResetPayload,
} from "@/types/auth";
import { UserRole } from "@/types/enums";
import { EMPLOYEE_SESSION_COOKIE } from "@/types/enums";

function getEmployeeSecret(): Uint8Array {
  const secret = process.env.EMPLOYEE_TOKEN_SECRET ?? process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("EMPLOYEE_TOKEN_SECRET or AUTH_SECRET must be defined");
  }
  return new TextEncoder().encode(secret);
}

function getResetSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET must be defined");
  }
  return new TextEncoder().encode(secret);
}

const EMPLOYEE_SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours
const RESET_TOKEN_MAX_AGE = 60 * 60; // 1 hour

export async function createEmployeeSession(
  payload: Omit<EmployeeSessionPayload, "role">
): Promise<string> {
  const token = await new SignJWT({
    ...payload,
    role: UserRole.EMPLOYEE,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EMPLOYEE_SESSION_MAX_AGE}s`)
    .sign(getEmployeeSecret());

  return token;
}

export async function verifyEmployeeSession(
  token: string
): Promise<EmployeeSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getEmployeeSecret());
    if (payload.role !== UserRole.EMPLOYEE) return null;

    return {
      employeeId: payload.employeeId as string,
      applicationRef: payload.applicationRef as string,
      email: payload.email as string,
      role: UserRole.EMPLOYEE,
    };
  } catch {
    return null;
  }
}

export async function setEmployeeSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(EMPLOYEE_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: EMPLOYEE_SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearEmployeeSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(EMPLOYEE_SESSION_COOKIE);
}

export async function getEmployeeSession(): Promise<EmployeeSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(EMPLOYEE_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyEmployeeSession(token);
}

export async function createPasswordResetToken(
  userId: string,
  email: string
): Promise<string> {
  return new SignJWT({ userId, email, purpose: "password_reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${RESET_TOKEN_MAX_AGE}s`)
    .sign(getResetSecret());
}

export async function verifyPasswordResetToken(
  token: string
): Promise<PasswordResetPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getResetSecret());
    if (payload.purpose !== "password_reset") return null;

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      purpose: "password_reset",
    };
  } catch {
    return null;
  }
}

export function getEmployeeSessionFromRequest(
  cookieValue: string | undefined
): Promise<EmployeeSessionPayload | null> {
  if (!cookieValue) return Promise.resolve(null);
  return verifyEmployeeSession(cookieValue);
}
