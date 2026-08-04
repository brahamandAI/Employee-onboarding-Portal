import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { middlewareAuth } from "@/lib/auth/middleware-auth";
import {
  canAccessRoute,
  isEmployeeRoute,
  isPublicRoute,
  isStaffAuthRoute,
  isApiAuthRoute,
} from "@/lib/auth/permissions";
import { EMPLOYEE_SESSION_COOKIE } from "@/types/enums";
import { getEmployeeSessionFromRequest } from "@/lib/auth/employee-session";
import { ROLE_DASHBOARD_PATH } from "@/types/enums";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (isApiAuthRoute(pathname)) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (isStaffAuthRoute(pathname)) {
    const session = await middlewareAuth();
    if (session?.user?.role) {
      const dashboard = ROLE_DASHBOARD_PATH[session.user.role];
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
    return NextResponse.next();
  }

  if (isEmployeeRoute(pathname)) {
    return NextResponse.redirect(new URL("/staff/login", request.url));
  }

  if (pathname.startsWith("/dashboard")) {
    const session = await middlewareAuth();

    if (!session?.user) {
      const loginUrl = new URL("/staff/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const { role } = session.user;

    if (!canAccessRoute(role, pathname)) {
      const correctDashboard = ROLE_DASHBOARD_PATH[role];
      return NextResponse.redirect(new URL(correctDashboard, request.url));
    }

    const response = NextResponse.next();
    response.headers.set("x-user-role", role);
    response.headers.set("x-user-id", session.user.id ?? "");
    return response;
  }

  if (pathname.startsWith("/api/documents")) {
    const employeeCookie = request.cookies.get(EMPLOYEE_SESSION_COOKIE)?.value;
    const employeeSession = await getEmployeeSessionFromRequest(employeeCookie);

    if (!employeeSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }

  // Staff document-folder APIs use NextAuth in the route handlers — do not
  // treat them as employee-session routes (prefix would match otherwise).
  if (pathname.startsWith("/api/employee-documents-folder")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/employee")) {
    const employeeCookie = request.cookies.get(EMPLOYEE_SESSION_COOKIE)?.value;
    const employeeSession = await getEmployeeSessionFromRequest(employeeCookie);

    if (!employeeSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/api/dashboard")) {
    const session = await middlewareAuth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (pathname === "/api/dashboard/live") {
      return NextResponse.next();
    }

    const rolePrefix = pathname.split("/")[3];
    if (rolePrefix) {
      const requiredPrefix = `/dashboard/${rolePrefix}`;
      if (!canAccessRoute(session.user.role, requiredPrefix)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
