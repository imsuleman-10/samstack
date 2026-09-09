import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, type UserRole } from "@/lib/auth";

// ─── Token extraction ─────────────────────────────────────────────────────────

async function getSession(request: NextRequest) {
  const token =
    request.cookies.get("session_token")?.value ||
    request.cookies.get("admin_token")?.value ||
    request.cookies.get("user_token")?.value;

  if (!token) return null;
  return verifySessionToken(token);
}

// ─── Route → allowed roles map ────────────────────────────────────────────────

type RouteRule = {
  prefix: string;
  allowedRoles: UserRole[];
  /** If true, redirect to /login on failure instead of returning 401 */
  isPage: boolean;
};

const PROTECTED_ROUTES: RouteRule[] = [
  // Admin pages & API
  { prefix: "/admin", allowedRoles: ["admin"], isPage: true },
  { prefix: "/api/admin", allowedRoles: ["admin"], isPage: false },

  // Mentor pages & API
  { prefix: "/mentor", allowedRoles: ["mentor", "admin"], isPage: true },
  { prefix: "/api/mentor", allowedRoles: ["mentor", "admin"], isPage: false },

  // Intern pages & API
  { prefix: "/intern", allowedRoles: ["intern", "user", "admin"], isPage: true },
  { prefix: "/api/intern", allowedRoles: ["intern", "user", "admin"], isPage: false },

  // Staff pages
  { prefix: "/staff", allowedRoles: ["staff", "admin"], isPage: true },
  { prefix: "/api/staff", allowedRoles: ["staff", "admin"], isPage: false },

  // General authenticated areas
  { prefix: "/dashboard", allowedRoles: ["admin", "mentor", "staff", "member"], isPage: true },
  { prefix: "/profile", allowedRoles: ["admin", "mentor", "intern", "staff", "member", "user"], isPage: true },
  { prefix: "/interns", allowedRoles: ["admin", "mentor", "intern", "staff", "member", "user"], isPage: true },
  { prefix: "/mentors", allowedRoles: ["admin", "mentor", "intern", "staff", "member", "user"], isPage: true },

  // API — profile (any auth)
  { prefix: "/api/profile", allowedRoles: ["admin", "mentor", "intern", "staff", "member", "user"], isPage: false },
  { prefix: "/api/interns", allowedRoles: ["admin", "mentor", "intern", "staff", "member", "user"], isPage: false },
  { prefix: "/api/mentors", allowedRoles: ["admin", "mentor", "intern", "staff", "member", "user"], isPage: false },
  { prefix: "/api/notifications", allowedRoles: ["admin", "mentor", "intern", "staff", "member", "user"], isPage: false },
  { prefix: "/api/upload", allowedRoles: ["admin", "mentor", "intern", "staff", "member", "user"], isPage: false },
  { prefix: "/api/dashboard", allowedRoles: ["admin", "mentor", "intern", "staff", "member", "user"], isPage: false },
];

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow legacy admin login API without auth check
  if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
    return NextResponse.next();
  }

  // Find the most specific matching rule
  const rule = PROTECTED_ROUTES
    .filter(r => pathname.startsWith(r.prefix))
    .sort((a, b) => b.prefix.length - a.prefix.length)[0];

  if (!rule) return NextResponse.next();

  const session = await getSession(request);

  if (!session) {
    if (rule.isPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  // Account status check
  if (session.status === "suspended") {
    if (rule.isPage) {
      const url = new URL("/login", request.url);
      url.searchParams.set("error", "suspended");
      return NextResponse.redirect(url);
    }
    return NextResponse.json({ error: "Your account has been suspended." }, { status: 403 });
  }

  if (session.status === "inactive") {
    if (rule.isPage) {
      const url = new URL("/login", request.url);
      url.searchParams.set("error", "inactive");
      return NextResponse.redirect(url);
    }
    return NextResponse.json({ error: "Your account is inactive." }, { status: 403 });
  }

  // Role check
  if (!rule.allowedRoles.includes(session.role)) {
    if (rule.isPage) {
      // Redirect to their correct dashboard
      const dashMap: Record<UserRole, string> = {
        admin: "/admin",
        mentor: "/mentor/dashboard",
        intern: "/intern/dashboard",
        staff: "/staff/dashboard",
        member: "/dashboard",
        user: "/intern/dashboard",
      };
      return NextResponse.redirect(new URL(dashMap[session.role] ?? "/dashboard", request.url));
    }
    return NextResponse.json({ error: "You do not have permission to access this resource." }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/mentor/:path*",
    "/api/mentor/:path*",
    "/intern/:path*",
    "/api/intern/:path*",
    "/staff/:path*",
    "/api/staff/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/interns/:path*",
    "/mentors/:path*",
    "/api/profile/:path*",
    "/api/interns/:path*",
    "/api/mentors/:path*",
    "/api/notifications/:path*",
    "/api/upload/:path*",
    "/api/dashboard/:path*",
    "/api/dashboard",
  ],
};
