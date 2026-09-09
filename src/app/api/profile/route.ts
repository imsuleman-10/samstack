import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import type { PlatformUser, InternProfile, MentorProfile, StaffProfile } from "@/lib/firestore-schema";


// ─── GET /api/profile — own profile ──────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const [userSnap, internProfileSnap, mentorProfileSnap, staffProfileSnap] = await Promise.all([
    adminDb.collection(FS.USERS).doc(session.id).get(),
    adminDb.collection(FS.INTERN_PROFILES).doc(session.id).get(),
    adminDb.collection(FS.MENTOR_PROFILES).doc(session.id).get(),
    adminDb.collection(FS.STAFF_PROFILES).doc(session.id).get(),
  ]);

  if (!userSnap.exists) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const user = userSnap.data() as PlatformUser;
  const internProfile = internProfileSnap.exists ? (internProfileSnap.data() as InternProfile) : null;
  const mentorProfile = mentorProfileSnap.exists ? (mentorProfileSnap.data() as MentorProfile) : null;
  const staffProfile = staffProfileSnap.exists ? (staffProfileSnap.data() as StaffProfile) : null;

  return NextResponse.json({ user, internProfile, mentorProfile, staffProfile });
}

// ─── PATCH /api/profile — update own profile ─────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const body = await req.json();

  // Fields a user is allowed to update on their own profile
  const allowedUserFields: (keyof PlatformUser)[] = [
    "full_name", "bio", "username", "city", "country", "address",
    "gender", "age", "region", "language", "date_of_birth", "phone", "skills", "social_links", "visibility",
  ];

  const userUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const field of allowedUserFields) {
    if (field in body) userUpdates[field] = body[field];
  }

  await adminDb.collection(FS.USERS).doc(session.id).update(userUpdates);

  // Update role-specific profile fields
  const now = new Date().toISOString();

  if ((session.role === "intern" || session.role === "user") && body.internProfile) {
    const allowedInternFields: (keyof InternProfile)[] = [
      "university", "high_education", "current_education", "degree", "semester", "cgpa", "department",
      "position", "skills", "joining_date", "end_date", "roll_number", "track_selected",
    ];
    const internUpdates: Record<string, unknown> = { updated_at: now };
    for (const field of allowedInternFields) {
      if (field in body.internProfile) internUpdates[field] = body.internProfile[field];
    }

    const internRef = adminDb.collection(FS.INTERN_PROFILES).doc(session.id);
    const internSnap = await internRef.get();
    if (internSnap.exists) {
      await internRef.update(internUpdates);
    } else {
      await internRef.set({ user_id: session.id, ...internUpdates, created_at: now });
    }

    if (session.role === "user") {
      await adminDb.collection(FS.USERS).doc(session.id).update({ role: "intern", updated_at: now }).catch(() => {});
    }
  }

  if (session.role === "mentor" && body.mentorProfile) {
    const allowedMentorFields: (keyof MentorProfile)[] = [
      "department", "designation", "experience", "skills", "bio",
    ];
    const mentorUpdates: Record<string, unknown> = { updated_at: now };
    for (const field of allowedMentorFields) {
      if (field in body.mentorProfile) mentorUpdates[field] = body.mentorProfile[field];
    }

    const mentorRef = adminDb.collection(FS.MENTOR_PROFILES).doc(session.id);
    const mentorSnap = await mentorRef.get();
    if (mentorSnap.exists) {
      await mentorRef.update(mentorUpdates);
    } else {
      await mentorRef.set({ user_id: session.id, ...mentorUpdates, created_at: now });
    }
  }

  return NextResponse.json({ success: true });
}
