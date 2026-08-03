import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateApplicationRef(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RS-APP-${dateStr}-${random}`;
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const masked =
    local.length <= 2
      ? `${local[0]}***`
      : `${local[0]}${"*".repeat(Math.min(local.length - 2, 4))}${local.slice(-1)}`;
  return `${masked}@${domain}`;
}

export function getBaseUrl(): string {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
