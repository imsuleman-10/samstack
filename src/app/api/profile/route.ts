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

  const rawUser = userSnap.data() as any;
  const internProfile = internProfileSnap.exists ? (internProfileSnap.data() as any) : null;
  const mentorProfile = mentorProfileSnap.exists ? (mentorProfileSnap.data() as MentorProfile) : null;
  const staffProfile = staffProfileSnap.exists ? (staffProfileSnap.data() as StaffProfile) : null;

  // Merge social links across collections to ensure seamless availability
  const userSocial = rawUser.social_links || rawUser.socialLinks || internProfile?.social_links || {};
  const mergedSocialLinks = {
    linkedin: userSocial.linkedin || rawUser.linkedin || internProfile?.linkedin || internProfile?.linkedin_url || '',
    github: userSocial.github || rawUser.github || internProfile?.github || internProfile?.github_url || '',
    instagram: userSocial.instagram || userSocial.twitter || rawUser.instagram || internProfile?.instagram || internProfile?.instagram_url || '',
    portfolio: userSocial.portfolio || rawUser.portfolio || internProfile?.portfolio || internProfile?.portfolio_url || '',
  };

  const user: PlatformUser = {
    ...rawUser,
    social_links: mergedSocialLinks,
  };

  return NextResponse.json({ user, internProfile, mentorProfile, staffProfile });
}

// ─── PATCH /api/profile — update own profile ─────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const body = await req.json();

  // Helper to strip undefined values so Firestore doesn't reject updates
  const sanitize = (obj: Record<string, any>) => {
    const clean: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) {
        if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
          clean[k] = sanitize(v);
        } else {
          clean[k] = v;
        }
      }
    }
    return clean;
  };

  // Fields a user is allowed to update on their own profile
  const allowedUserFields = [
    "full_name", "bio", "username", "city", "country", "address",
    "gender", "age", "region", "language", "date_of_birth", "phone", "skills",
    "social_links", "socialLinks", "instagram", "linkedin", "github", "portfolio", "visibility",
  ];

  const rawUserUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const field of allowedUserFields) {
    if (field in body) rawUserUpdates[field] = body[field];
  }

  // If social_links is present, mirror onto individual fields for backward compatibility
  if (body.social_links && typeof body.social_links === 'object') {
    if (body.social_links.instagram) rawUserUpdates.instagram = body.social_links.instagram;
    if (body.social_links.linkedin) rawUserUpdates.linkedin = body.social_links.linkedin;
    if (body.social_links.github) rawUserUpdates.github = body.social_links.github;
  }

  const userUpdates = sanitize(rawUserUpdates);
  await adminDb.collection(FS.USERS).doc(session.id).set(userUpdates, { merge: true });

  // Update role-specific profile fields
  const now = new Date().toISOString();

  if ((session.role === "intern" || session.role === "user") && body.internProfile) {
    const allowedInternFields = [
      "university", "high_education", "current_education", "degree", "semester", "cgpa", "department",
      "position", "skills", "joining_date", "end_date", "roll_number", "track_selected", "resume_url",
      "social_links", "instagram_url", "linkedin_url", "github_url",
    ];
    const rawInternUpdates: Record<string, unknown> = { updated_at: now };
    for (const field of allowedInternFields) {
      if (field in body.internProfile) rawInternUpdates[field] = body.internProfile[field];
    }
    // Also attach social links to internProfile
    if (body.social_links) {
      rawInternUpdates.social_links = body.social_links;
      if (body.social_links.instagram) rawInternUpdates.instagram_url = body.social_links.instagram;
      if (body.social_links.linkedin) rawInternUpdates.linkedin_url = body.social_links.linkedin;
      if (body.social_links.github) rawInternUpdates.github_url = body.social_links.github;
    }

    const internUpdates = sanitize(rawInternUpdates);
    const internRef = adminDb.collection(FS.INTERN_PROFILES).doc(session.id);
    await internRef.set({ user_id: session.id, ...internUpdates }, { merge: true });

    if (session.role === "user") {
      await adminDb.collection(FS.USERS).doc(session.id).set({ role: "intern", updated_at: now }, { merge: true }).catch(() => {});
    }
  }

  if (session.role === "mentor" && body.mentorProfile) {
    const allowedMentorFields: (keyof MentorProfile)[] = [
      "department", "designation", "experience", "skills", "bio",
    ];
    const rawMentorUpdates: Record<string, unknown> = { updated_at: now };
    for (const field of allowedMentorFields) {
      if (field in body.mentorProfile) rawMentorUpdates[field] = body.mentorProfile[field];
    }

    const mentorUpdates = sanitize(rawMentorUpdates);
    const mentorRef = adminDb.collection(FS.MENTOR_PROFILES).doc(session.id);
    await mentorRef.set({ user_id: session.id, ...mentorUpdates }, { merge: true });
  }

  return NextResponse.json({ success: true });
}
