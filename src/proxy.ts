import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/services/auth/session";

const protectedRoutes = [
  "/dashboard",
  "/clients",
  "/market/us",
  "/market/mexico",
  "/trading",
  "/portfolio",
  "/institutional",
  "/templates",
  "/reports",
  "/settings",
];

function routeMatches(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(sessionToken);
  const isProtectedRoute = protectedRoutes.some((route) =>
    routeMatches(pathname, route),
  );

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/clients/:path*",
    "/market/us/:path*",
    "/market/mexico/:path*",
    "/trading/:path*",
    "/portfolio/:path*",
    "/institutional/:path*",
    "/templates/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
