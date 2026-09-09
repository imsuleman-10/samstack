import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { createAdminDb } from "@/lib/db";

// Check if phone or email is already registered in Firestore
export async function POST(request: NextRequest) {
  try {
    const { phone, email } = await request.json();
    if (!adminDb) return NextResponse.json({ error: "Database not initialized" }, { status: 503 });
    const adb = createAdminDb(adminDb);

    // Normalize phone
    const cleaned = (phone || '').replace(/[^0-9+]/g, '');
    const normalized = cleaned.startsWith('+') ? cleaned : `+92${cleaned.replace(/^0/, '')}`;

    // Check phone uniqueness
    if (normalized && normalized.length > 4) {
      const phoneUser = await adb.users.getByPhone(normalized);
      if (phoneUser) {
        return NextResponse.json(
          { error: "This phone number is already registered. Please login instead." },
          { status: 409 }
        );
      }
    }

    // Check email uniqueness
    if (email) {
      const emailUser = await adb.users.getByEmail(email.trim().toLowerCase());
      if (emailUser) {
        return NextResponse.json(
          { error: "This email is already registered. Please login instead." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Check-unique error:", err);
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}
