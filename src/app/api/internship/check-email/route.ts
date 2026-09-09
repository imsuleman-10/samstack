import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawEmail = searchParams.get("email");

    if (!rawEmail || !rawEmail.trim()) {
      return NextResponse.json({ error: "Email parameter is required." }, { status: 400 });
    }

    const email = rawEmail.trim().toLowerCase();

    // 1. Check in Firestore if Firebase Admin is configured
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && adminDb) {
      try {
        const profileSnap = await adminDb
          .collection("intern_profiles")
          .where("email", "==", email)
          .limit(1)
          .get();

        if (!profileSnap.empty) {
          return NextResponse.json({
            exists: true,
            message: "An application with this email has already been submitted. Multiple submissions using the same email are not allowed.",
          });
        }

        const legacySnap = await adminDb
          .collection("interns")
          .where("email", "==", email)
          .limit(1)
          .get();

        if (!legacySnap.empty) {
          return NextResponse.json({
            exists: true,
            message: "An application with this email has already been submitted. Multiple submissions using the same email are not allowed.",
          });
        }

        const userSnap = await adminDb
          .collection("users")
          .where("email", "==", email)
          .limit(1)
          .get();

        if (!userSnap.empty) {
          const userData = userSnap.docs[0].data();
          if (userData.role === "intern") {
            return NextResponse.json({
              exists: true,
              message: "An intern application with this email has already been registered. Multiple submissions are not allowed.",
            });
          }
        }
      } catch (err: any) {
        console.warn("[check-email] Firestore duplicate check skipped:", err.message);
      }
    }

    // 2. Check local database .data/db.json (used in local development)
    try {
      const dbPath = path.join(process.cwd(), ".data", "db.json");
      if (fs.existsSync(dbPath)) {
        const dbData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
        const existingIntern = dbData.interns?.find(
          (i: any) => (i.email || "").trim().toLowerCase() === email
        );
        if (existingIntern) {
          return NextResponse.json({
            exists: true,
            message: "An application with this email has already been submitted. Multiple submissions using the same email are not allowed.",
          });
        }
      }
    } catch {
      // ignore local file read error
    }

    return NextResponse.json({ exists: false });
  } catch (error: any) {
    console.error("Check application email error:", error);
    return NextResponse.json({ exists: false });
  }
}
