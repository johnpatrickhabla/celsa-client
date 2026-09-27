import { NextRequest, NextResponse } from "next/server";
import { decodeToken } from "@/lib/auth";

/**
 * Frontend-side RBAC gate. This only controls page access/navigation —
 * it is NOT the security boundary. Every Express API route re-checks
 * role via its own middleware, since a token can be replayed directly
 * against the API without ever loading these pages.
 */
const ADMIN_ONLY = ["/admin/reports", "/admin/users"];
const ADMIN_AND_STAFF_PREFIXES = ["/admin", "/staff"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("celsa_token")?.value;
  const user = decodeToken(token);

  const isProtected = ADMIN_AND_STAFF_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Not logged in at all -> send to login, preserve intended destination
  if (!user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Customers can never reach /admin or /staff
  if (user.role === "customer") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Staff can reach /staff freely, but not /admin at all
  if (user.role === "staff" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/staff/dashboard", req.url));
  }

  // Admin-only sub-sections (Reports, Users/Staff account management),
  // per the RBAC table: Staff has no access to Reports or Staff Account Management
  if (user.role === "staff" && ADMIN_ONLY.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/staff/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*"],
};
