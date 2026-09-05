import { cache } from "react";
import { auth } from "@/lib/auth/config";
import { StaffRole } from "@/types/enums";
import { canAccessRoute } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { ROLE_DASHBOARD_PATH } from "@/types/enums";

const getSession = cache(() => auth());

export async function requireStaffAuth(requiredRole?: StaffRole) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/staff/login");
  }

  const { role, id, email, name } = session.user;

  if (requiredRole && role !== requiredRole) {
    redirect(ROLE_DASHBOARD_PATH[role]);
  }

  return { user: { id, email, name, role } };
}

export async function requireRoleAccess(pathname: string) {
  const session = await getSession();

  if (!session?.user) {
    return { authorized: false as const, reason: "unauthenticated" as const };
  }

  const { role } = session.user;

  if (!canAccessRoute(role, pathname)) {
    return {
      authorized: false as const,
      reason: "forbidden" as const,
      role,
    };
  }

  return {
    authorized: true as const,
    user: session.user,
  };
}

export async function getStaffSession() {
  return getSession();
}
