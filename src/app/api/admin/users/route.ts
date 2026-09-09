import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { adminAuth } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { auditLog } from "@/lib/audit";
import { sendWelcomeEmailWithPassword, sendWelcomeEmailGoogle } from "@/lib/mailer";
import { FS } from "@/lib/firestore-schema";
import type { PlatformUser, UserRole, AccountStatus } from "@/lib/firestore-schema";

// ─── GET /api/admin/users — paginated, searchable user list ──────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;

  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "25"));

  let q = adminDb.collection(FS.USERS) as FirebaseFirestore.Query;
  if (role) q = q.where("role", "==", role);
  if (status) q = q.where("status", "==", status);

  let allDocs: FirebaseFirestore.QueryDocumentSnapshot[] = [];
  try {
    // Try with orderBy — requires a composite index when filtering by role/status
    const snapshot = await q.orderBy("created_at", "desc").get();
    allDocs = snapshot.docs;
  } catch (indexErr: any) {
    // Composite index not yet created — fall back to unordered, sort in memory
    console.warn("[users] Missing index, sorting in memory:", indexErr?.message?.slice(0, 120));
    const snapshot = await q.get();
    allDocs = snapshot.docs.sort((a, b) => {
      const aDate = a.data().created_at ?? "";
      const bDate = b.data().created_at ?? "";
      return bDate.localeCompare(aDate);
    });
  }

  let users = allDocs.map(d => ({ id: d.id, ...d.data() }) as PlatformUser);

  if (search) {
    users = users.filter(
      u =>
        u.full_name?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search) ||
        u.username?.toLowerCase().includes(search)
    );
  }

  const total = users.length;
  const paginated = users.slice((page - 1) * limit, page * limit);

  // For intern role, merge intern_profiles data (track, roll_number) into each user
  let enrichedUsers: any[] = paginated;
  if (role === 'intern' && paginated.length > 0) {
    const profileFetches = paginated.map(u =>
      adminDb!.collection(FS.INTERN_PROFILES).doc(u.id).get().catch(() => null)
    );
    const profiles = await Promise.all(profileFetches);
    enrichedUsers = paginated.map((u, i) => {
      const prof = profiles[i]?.exists ? profiles[i]!.data() : null;
      return {
        ...u,
        track_selected: prof?.track_selected || prof?.trackSelected || null,
        roll_number: prof?.roll_number || null,
      };
    });
  }

  return NextResponse.json({ users: enrichedUsers, total, page, limit, pages: Math.ceil(total / limit) });
}

// ─── POST /api/admin/users — create user ─────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;

  if (!adminDb || !adminAuth)
    return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const body = await req.json();
  const { full_name, email, password, role, phone, department, position, status = "active", avatar_url, authProvider = "email" } =
    body as {
      full_name: string; email: string; password?: string; role: UserRole;
      phone?: string; department?: string; position?: string;
      status?: AccountStatus; avatar_url?: string; authProvider?: string;
    };

  if (!full_name || !email || !role)
    return NextResponse.json({ error: "full_name, email, and role are required." }, { status: 400 });

  if (authProvider === "email" && !password)
    return NextResponse.json({ error: "password is required for email authentication." }, { status: 400 });

  const allowedRoles: UserRole[] = ["intern", "mentor", "staff", "member", "user"];
  if (!allowedRoles.includes(role))
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });

  try {
    let fbUid: string;
    
    if (authProvider === "email") {
      const fbUser = await adminAuth.createUser({ email, password, displayName: full_name });
      fbUid = fbUser.uid;
    } else {
      // For Google Provider, we might create a user without a password to reserve the email
      // Or just create the user. Firebase allows creating users without a password.
      const fbUser = await adminAuth.createUser({ email, displayName: full_name });
      fbUid = fbUser.uid;
    }

    const now = new Date().toISOString();
    const userDoc: PlatformUser = {
      id: fbUid, full_name: full_name.trim(), email: email.toLowerCase(),
      phone: phone ?? null, avatar_url: avatar_url ?? null, role, status,
      visibility: "organization", skills: [], created_at: now, updated_at: now,
    };
    await adminDb.collection(FS.USERS).doc(fbUid).set(userDoc);

    if (role === "intern") {
      await adminDb.collection(FS.INTERN_PROFILES).doc(fbUid).set({
        user_id: fbUid, department: department ?? null, position: position ?? null, created_at: now, updated_at: now,
      });
    } else if (role === "mentor") {
      await adminDb.collection(FS.MENTOR_PROFILES).doc(fbUid).set({
        user_id: fbUid, department: department ?? null, designation: position ?? null, created_at: now, updated_at: now,
      });
    } else if (role === "staff") {
      await adminDb.collection(FS.STAFF_PROFILES).doc(fbUid).set({
        user_id: fbUid, department: department ?? null, position: position ?? null, created_at: now, updated_at: now,
      });
    }

    // Send Welcome Email
    if (authProvider === "email" && password) {
      await sendWelcomeEmailWithPassword(email, full_name, password, role).catch(err => console.error("Failed to send welcome email:", err));
    } else {
      await sendWelcomeEmailGoogle(email, full_name, role).catch(err => console.error("Failed to send welcome email:", err));
    }

    await auditLog(session.id, "CREATE_USER", fbUid, { role, email });
    return NextResponse.json({ success: true, id: fbUid }, { status: 201 });
  } catch (error: any) {
    const msg = error?.message || "Unknown error";
    const code = error?.code || "";
    console.error("Create user error:", code, msg);

    if (
      code === "auth/email-already-exists" ||
      code === "auth/email-already-in-use" ||
      msg.toLowerCase().includes("email-already-exists") ||
      msg.toLowerCase().includes("already in use") ||
      msg.toLowerCase().includes("already exists")
    ) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    if (code === "auth/invalid-password" || code === "auth/weak-password" || msg.toLowerCase().includes("password")) {
      return NextResponse.json(
        { error: msg || "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (code === "auth/invalid-email" || msg.toLowerCase().includes("invalid email")) {
      return NextResponse.json(
        { error: "The provided email address is invalid." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: msg || "Failed to create user." },
      { status: 400 }
    );
  }
}
