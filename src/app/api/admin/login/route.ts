import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signAdminToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "samstacktechs@gmail.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Salman123@";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (
      email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      const token = await signAdminToken({ email: ADMIN_EMAIL });

      const cookieStore = await cookies();
      const cookieOpts = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      };

      cookieStore.set("session_token", token, cookieOpts);
      cookieStore.set("admin_token", token, cookieOpts);

      return NextResponse.json({
        success: true,
        message: "Authentication successful.",
        dashboard: "/admin",
        role: "admin",
      });
    }

    return NextResponse.json({ error: "Invalid operator credentials. Access Denied." }, { status: 401 });
  } catch (error) {
    console.error("Admin authentication error:", error);
    return NextResponse.json({ error: "Internal server error occurred during authentication." }, { status: 500 });
  }
}
