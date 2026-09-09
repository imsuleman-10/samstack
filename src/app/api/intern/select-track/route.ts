import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import crypto from "crypto";

const TRACK_CODES: Record<string, string> = {
  PYTHON: "PY",
  UI_UX: "UX",
  CPP: "CP",
  WEB_DEV: "WD",
  REACT: "RX",
  NEXT_JS: "NJ",
  MERN: "MN",
  FRONTEND: "WD",
  BACKEND: "MN",
};

export async function POST(req: NextRequest) {
  const authRes = await requireAuth(req);
  if (isAuthError(authRes)) return authRes;
  const { session } = authRes;

  if (!adminDb) {
    return NextResponse.json({ error: "Firebase admin DB not available" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { track, gender, age, university, city } = body;

    if (!track) {
      return NextResponse.json({ error: "Track is required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const userId = session.id;

    // 1. Update user role to intern and update user metadata if provided
    const userRef = adminDb.collection(FS.USERS).doc(userId);
    const userSnap = await userRef.get();

    const userUpdates: Record<string, any> = {
      role: "intern",
      track: track,
      updated_at: now,
    };
    if (gender) userUpdates.gender = gender;
    if (age) userUpdates.age = age;
    if (city) userUpdates.city = city;

    if (userSnap.exists) {
      await userRef.update(userUpdates);
    } else {
      await userRef.set({
        id: userId,
        email: session.email || "",
        full_name: session.email?.split("@")[0] || "Intern",
        role: "intern",
        track: track,
        status: "active",
        created_at: now,
        ...userUpdates,
      });
    }

    // Set custom user claim if possible
    if (adminAuth) {
      await adminAuth.setCustomUserClaims(userId, { role: "intern" }).catch(() => {});
    }

    // 2. Generate Roll Number
    const uppercaseTrack = track.toUpperCase();
    const code = TRACK_CODES[uppercaseTrack] || "IN";
    const ts = Date.now().toString().slice(-6);
    const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
    const rollNumber = `SAM-${code}-${ts}-${rand}`;

    // 3. Mentor Assignment Logic
    let mentorName = "";
    const g = (gender || userSnap.data()?.gender || "").toLowerCase();
    const t = track.toLowerCase();

    if (g === "female") {
      mentorName = "Suleman Zaheer";
    } else {
      if (t.includes("backend") || t.includes("mern") || t.includes("python")) {
        mentorName = "Syed Abdullah";
      } else {
        mentorName = "Saqib Javed";
      }
    }

    let mentorId = "";
    const mentorQuery = await adminDb
      .collection(FS.USERS)
      .where("role", "==", "mentor")
      .where("full_name", "==", mentorName)
      .get();

    if (!mentorQuery.empty) {
      mentorId = mentorQuery.docs[0].id;
    }

    // 4. Create or Update Intern Profile
    const internProfileRef = adminDb.collection(FS.INTERN_PROFILES).doc(userId);
    const internProfileSnap = await internProfileRef.get();

    if (!internProfileSnap.exists) {
      await internProfileRef.set({
        user_id: userId,
        track_selected: track,
        roll_number: rollNumber,
        university: university || "",
        mentor_id: mentorId || null,
        certificate_status: null,
        offer_letter_sent: false,
        created_at: now,
        updated_at: now,
      });
    } else {
      const existingData = internProfileSnap.data();
      await internProfileRef.update({
        track_selected: track,
        roll_number: existingData?.roll_number || rollNumber,
        university: university || existingData?.university || "",
        mentor_id: existingData?.mentor_id || mentorId || null,
        updated_at: now,
      });
    }

    const response = NextResponse.json({
      success: true,
      message: "Track selected successfully!",
      track,
      rollNumber,
    });

    // Re-issue updated session cookie with 'intern' role so client immediately has active intern session
    try {
      const { signSessionToken } = await import("@/lib/auth");
      const updatedToken = await signSessionToken({
        id: session.id,
        role: "intern",
        email: session.email,
        status: session.status,
      });

      response.cookies.set("session_token", updatedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    } catch (tokenErr) {
      console.error("Failed to update session token cookie:", tokenErr);
    }

    return response;
  } catch (err: any) {
    console.error("Select track error:", err);
    return NextResponse.json({ error: err.message || "Failed to select track" }, { status: 500 });
  }
}
