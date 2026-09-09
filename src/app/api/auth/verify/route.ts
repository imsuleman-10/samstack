import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase-admin";
import { signSessionToken, type UserRole, type AccountStatus } from "@/lib/auth";

const getFirebaseApiKey = () => process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";

/** Role → dashboard route map */
const ROLE_DASHBOARD: Record<UserRole, string> = {
  admin: "/admin",
  mentor: "/mentor/dashboard",
  intern: "/intern/dashboard",
  staff: "/staff/dashboard",
  member: "/dashboard",
  user: "/intern/dashboard",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, fullName, phone, email, track, gender } = body as {
      token?: string;
      fullName?: string;
      phone?: string;
      email?: string;
      track?: string;
      gender?: string;
    };

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // ─── Verify Firebase ID token via Google Identity Toolkit ───────────────
    const tokenInfoRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${getFirebaseApiKey()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      }
    );

    const tokenInfo = await tokenInfoRes.json();
    if (!tokenInfoRes.ok || !tokenInfo.users?.length) {
      console.error("Token verification failed:", tokenInfo);
      return NextResponse.json({ error: "Invalid Firebase token" }, { status: 401 });
    }

    const firebaseUid: string = tokenInfo.users[0].localId;
    const firebaseEmail: string = tokenInfo.users[0].email ?? "";

    // ─── Resolve phone / email ───────────────────────────────────────────────
    let resolvedPhone: string | null = phone?.trim() || null;
    let resolvedEmail: string | null = email?.trim().toLowerCase() || null;

    if (firebaseEmail.endsWith("@samstack.com")) {
      // Legacy phone-based login
      if (!resolvedPhone) resolvedPhone = firebaseEmail.split("@")[0];
    } else if (firebaseEmail && !resolvedEmail) {
      resolvedEmail = firebaseEmail;
    }

    if (!adminDb) throw new Error("Firebase Admin DB not initialized");

    // ─── Upsert user in Firestore ────────────────────────────────────────────
    const userDocRef = adminDb.collection("users").doc(firebaseUid);
    const userSnapshot = await userDocRef.get();

    let user: Record<string, unknown>;

    if (!userSnapshot.exists) {
      // New user — if track is provided, set as intern, else user
      const assignedRole: UserRole = track ? "intern" : "intern";
      const insertPayload: Record<string, unknown> = {
        id: firebaseUid,
        full_name: fullName?.trim() || "New Intern",
        role: assignedRole,
        status: "active" as AccountStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (resolvedPhone) insertPayload.phone_number = resolvedPhone;
      if (resolvedEmail) insertPayload.email = resolvedEmail;
      if (gender) insertPayload.gender = gender;
      if (track) insertPayload.track = track;

      await userDocRef.set(insertPayload);
      user = insertPayload;
    } else {
      user = userSnapshot.data() as Record<string, unknown>;

      // Update missing fields — upgrade generic "user" role to "intern"
      const updates: Record<string, unknown> = {};
      if (user.role === "user") updates.role = "intern";
      if (!user.phone_number && resolvedPhone) updates.phone_number = resolvedPhone;
      if (!user.email && resolvedEmail) updates.email = resolvedEmail;
      if (!user.full_name && fullName?.trim()) updates.full_name = fullName.trim();
      if (!user.gender && gender) updates.gender = gender;
      if (!user.track && track) updates.track = track;
      if (!user.status) updates.status = "active";
      if (Object.keys(updates).length > 0) {
        updates.updated_at = new Date().toISOString();
        await userDocRef.update(updates);
        Object.assign(user, updates);
      }
    }

    // If track was provided or user is intern, ensure intern_profiles exists
    if (track || user.role === "intern") {
      const internRef = adminDb.collection("intern_profiles").doc(firebaseUid);
      const internSnap = await internRef.get();
      if (!internSnap.exists && track) {
        const rollNumber = `SAM-${track.toUpperCase().slice(0, 2)}-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
        await internRef.set({
          user_id: firebaseUid,
          track_selected: track,
          roll_number: rollNumber,
          certificate_status: null,
          offer_letter_sent: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    const role = (user.role as UserRole) ?? "intern";
    const status = (user.status as AccountStatus) ?? "active";

    // ─── Block suspended/inactive accounts ──────────────────────────────────
    if (status === "suspended") {
      return NextResponse.json({ error: "Your account has been suspended." }, { status: 403 });
    }
    if (status === "inactive") {
      return NextResponse.json({ error: "Your account is inactive." }, { status: 403 });
    }

    // ─── Sign unified session token ──────────────────────────────────────────
    const sessionToken = await signSessionToken({
      id: firebaseUid,
      role,
      email: resolvedEmail ?? undefined,
      status,
    });

    // ─── Set unified session_token cookie (+ clear legacy cookies) ──────────
    const cookieStore = await cookies();
    cookieStore.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    // Clear legacy separate cookies if they exist
    cookieStore.delete("admin_token");
    cookieStore.delete("user_token");

    // ─── Update last_login ───────────────────────────────────────────────────
    await userDocRef.update({ last_login: new Date().toISOString() }).catch(() => {});

    return NextResponse.json({
      success: true,
      role,
      status,
      dashboard: ROLE_DASHBOARD[role],
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Auth verification error:", msg);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
