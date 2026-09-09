import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import crypto from "crypto";
import { createAdminDb } from "@/lib/db";
import { tracks } from "@/lib/curriculum";
import { generateOfferLetterPDF } from "@/lib/pdfTemplates";
import { sendOfferLetterEmail } from "@/lib/mailer";
import { signSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";



const rateLimit = new Map<string, { count: number; timestamp: number }>();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const cd = rateLimit.get(ip);
    if (cd && now - cd.timestamp < 60000) {
      if (cd.count >= 5)
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      cd.count++;
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    const body = await request.json();
    const {
      firstName, lastName, email, phone, password,
      city, university, degree, graduationYear, cgpa,
      linkedIn, github, portfolio, summary,
      track, covenantAccepted, firebaseUid, firebaseToken, gender
    } = body;

    // ─── Validations ───
    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }
    if (!phone?.trim()) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }
    if (!track) {
      return NextResponse.json({ error: "Specialization track must be selected." }, { status: 400 });
    }
    if (!covenantAccepted) {
      return NextResponse.json({ error: "You must accept the Honor Covenant." }, { status: 400 });
    }
    if (!firebaseUid || !firebaseToken) {
      return NextResponse.json({ error: "Authentication failed. Please try again." }, { status: 400 });
    }

    // ─── Verify Firebase token ───
    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: firebaseToken }),
      }
    );
    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData.users?.[0]) {
      return NextResponse.json({ error: "Firebase token verification failed." }, { status: 401 });
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const uppercaseTrack = track.toUpperCase();
    const validTracks = ["PYTHON", "UI_UX", "CPP", "WEB_DEV", "REACT", "NEXT_JS", "MERN"];
    if (!validTracks.includes(uppercaseTrack)) {
      return NextResponse.json({ error: `Invalid track: ${track}` }, { status: 400 });
    }

    // ─── Generate Roll Number ───
    const trackCodes: Record<string, string> = {
      PYTHON: "PY", UI_UX: "UX", CPP: "CP", WEB_DEV: "WD", REACT: "RX", NEXT_JS: "NJ", MERN: "MN",
    };
    const code = trackCodes[uppercaseTrack] || "IN";
    const ts = Date.now();
    const rand = crypto.randomBytes(2).toString('hex').toUpperCase();
    const rollNumber = `SAM-${code}-${ts}-${rand}`;

    const adb = createAdminDb(adminDb!);

    // ─── Enforce 1 account per email / prevent duplicate signups ───
    if (email) {
      const existingEmailUser = await adb.users.getByEmail(email.trim().toLowerCase());
      if (existingEmailUser && existingEmailUser.id !== firebaseUid) {
        return NextResponse.json(
          { error: "Already an account exists with this email. Please login instead." },
          { status: 409 }
        );
      }
    }

    const existingProfile = await adb.internProfiles.get(firebaseUid);
    if (existingProfile) {
      return NextResponse.json(
        { error: "An application has already been submitted for this account. Please login to access your portal." },
        { status: 409 }
      );
    }

    // ─── Upsert user in Firestore ───
    const existingUser = await adb.users.get(firebaseUid);
    if (!existingUser) {
      await adb.users.create(firebaseUid, {
        full_name: fullName,
        phone_number: phone.trim(),
        email: email?.trim().toLowerCase() || null,
        role: 'intern',
        gender: gender || null,
        image_url: null,
        assigned_tracks: [],
      });
    } else {
      await adb.users.update(firebaseUid, {
        full_name: fullName,
        phone_number: phone.trim(),
        email: email?.trim().toLowerCase() || null,
        gender: gender || null,
      });
    }

    // ─── Upsert intern_profile in Firestore ───
    await adb.internProfiles.upsert(firebaseUid, {
      user_id: firebaseUid,
      track_selected: uppercaseTrack,
      university: university?.trim() || null,
      degree: degree?.trim() || null,
      city: city?.trim() || null,
      cgpa: cgpa?.trim() || null,
      linkedin_url: linkedIn?.trim() || null,
      github_url: github?.trim() || null,
      portfolio_url: portfolio?.trim() || null,
      roll_number: rollNumber,
      email: email?.trim() || null,
      phone_number: phone.trim(),
      application_status: 'APPLIED',
      start_date: new Date().toISOString().split("T")[0],
      enrolled_at: new Date().toISOString(),
      assigned_mentor_id: null,
    });

    // ─── Issue JWT Session ───
    const sessionToken = await signSessionToken({
      id: firebaseUid,
      role: "intern",
      email: email?.trim().toLowerCase() || undefined,
      status: "active",
    });

    const cookieStore = await cookies();
    cookieStore.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    // Clear legacy tokens if present
    cookieStore.delete("user_token");
    cookieStore.delete("admin_token");

    // ─── Send Offer Letter async ───
    if (email?.trim()) {
      const trackTitle = tracks[uppercaseTrack as keyof typeof tracks]?.title || uppercaseTrack;
      (async () => {
        try {
          const dateStr = new Date().toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          });
          const pdfBuffer = await generateOfferLetterPDF({
            fullName, rollNumber, track: trackTitle, date: dateStr,
          });
          await sendOfferLetterEmail(email.trim(), fullName, rollNumber, trackTitle, pdfBuffer);
        } catch (e) {
          console.error("Offer letter email error:", e);
        }
      })();
    }

    return NextResponse.json({
      success: true,
      rollNumber,
      fullName,
      track: uppercaseTrack,
      redirectTo: "/dashboard",
    });
  } catch (err: any) {
    console.error("Apply error:", err);
    return NextResponse.json({ error: err.message || "Application failed." }, { status: 500 });
  }
}
