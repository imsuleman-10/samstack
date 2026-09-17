import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  // Safe diagnostic endpoint - only reports if vars EXIST, never their values
  const envReport = {
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_PRIVATE_KEY_VALID: process.env.FIREBASE_PRIVATE_KEY?.includes('BEGIN PRIVATE KEY') ?? false,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    JWT_SECRET: !!process.env.JWT_SECRET,
    EMAIL_USER: !!process.env.EMAIL_USER,
    EMAIL_PASS: !!process.env.EMAIL_PASS,
    ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  };

  // Try to init firebase-admin and catch any error
  let firebaseStatus: string;
  let firebaseError: string | null = null;
  try {
    const { adminDb } = await import("@/lib/firebase-admin");
    firebaseStatus = adminDb ? "initialized_ok" : "initialized_but_null";
  } catch (e: any) {
    firebaseStatus = "CRASHED";
    firebaseError = e?.message ?? String(e);
  }

  return NextResponse.json({
    envReport,
    firebaseStatus,
    firebaseError,
    timestamp: new Date().toISOString(),
  });
}
