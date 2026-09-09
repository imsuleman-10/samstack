import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { auditLog } from "@/lib/audit";
import { sendWelcomeEmailWithPassword, sendWelcomeEmailGoogle } from "@/lib/mailer";
import { FS } from "@/lib/firestore-schema";
import type { PlatformUser, UserRole, AccountStatus } from "@/lib/firestore-schema";
import fs from "fs";
import path from "path";

function getLocalUsersFallback(roleFilter?: string | null, statusFilter?: string | null, search?: string, page = 1, limit = 25) {
  let interns: any[] = [];
  try {
    const dbPath = path.join(process.cwd(), ".data", "db.json");
    if (fs.existsSync(dbPath)) {
      const raw = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      interns = raw.interns || [];
    }
  } catch (e) {
    console.warn("[users] Fallback read error:", e);
  }

  const allUsers: any[] = [
    {
      id: "admin-suleman",
      full_name: "Suleman Zaheer",
      email: "admin@samstack.tech",
      role: "admin",
      status: "active",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
      skills: ["Next.js", "System Architecture", "DevOps"],
    },
    {
      id: "mentor-saqib",
      full_name: "Saqib Javed",
      email: "saqib@samstack.tech",
      role: "mentor",
      status: "active",
      created_at: "2026-02-01T00:00:00.000Z",
      updated_at: "2026-02-01T00:00:00.000Z",
      skills: ["React", "UI/UX", "Tailwind CSS"],
    },
    {
      id: "staff-abdullah",
      full_name: "Syed Abdullah",
      email: "abdullah@samstack.tech",
      role: "staff",
      status: "active",
      created_at: "2026-02-15T00:00:00.000Z",
      updated_at: "2026-02-15T00:00:00.000Z",
      skills: ["Node.js", "Databases", "APIs"],
    },
  ];

  for (const i of interns) {
    allUsers.push({
      id: i.id,
      full_name: i.fullName || "Intern Applicant",
      email: i.email || "applicant@samstack.tech",
      role: "intern",
      status: i.status === "APPROVED" ? "active" : i.status === "REJECTED" ? "suspended" : "pending",
      created_at: i.applicationTimestamp || new Date().toISOString(),
      updated_at: i.submissionData?.submissionTimestamp || i.applicationTimestamp || new Date().toISOString(),
      track_selected: i.trackSelected,
      roll_number: i.rollNumber,
      certificate_status: i.status === "APPROVED" ? "approved" : i.status === "SUBMITTED" ? "pending" : null,
    });
  }

  let filtered = allUsers;
  if (roleFilter) {
    filtered = filtered.filter(u => u.role === roleFilter);
  }
  if (statusFilter) {
    filtered = filtered.filter(u => u.status === statusFilter);
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      u =>
        u.full_name?.toLowerCase().includes(s) ||
        u.email?.toLowerCase().includes(s) ||
        u.roll_number?.toLowerCase().includes(s)
    );
  }

  filtered.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return {
    users: paginated,
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}

// ─── GET /api/admin/users — paginated, searchable user list ──────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "25"));

  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && adminDb) {
    try {
      let q = adminDb.collection(FS.USERS) as FirebaseFirestore.Query;
      if (role) q = q.where("role", "==", role);
      if (status) q = q.where("status", "==", status);

      let allDocs: FirebaseFirestore.QueryDocumentSnapshot[] = [];
      try {
        const snapshot = await q.orderBy("created_at", "desc").get();
        allDocs = snapshot.docs;
      } catch {
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
    } catch (err: any) {
      console.warn("[admin/users] Firestore error, falling back to local data:", err.message);
    }
  }

  // Graceful fallback for local development
  return NextResponse.json(getLocalUsersFallback(role, status, search, page, limit));
}

// ─── POST /api/admin/users — create user ─────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;

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

  // Save to local database fallback if Firebase Admin not configured
  if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL || !adminDb || !adminAuth) {
    try {
      const dbPath = path.join(process.cwd(), ".data", "db.json");
      let dbData: any = { interns: [] };
      if (fs.existsSync(dbPath)) {
        dbData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      }
      const newId = `user-${Date.now()}`;
      if (role === 'intern') {
        dbData.interns = dbData.interns || [];
        dbData.interns.push({
          id: newId,
          fullName: full_name.trim(),
          email: email.toLowerCase(),
          trackSelected: department || "Full Stack",
          rollNumber: `SAM-${new Date().getFullYear()}-${String(dbData.interns.length + 1).padStart(4, '0')}`,
          status: "APPROVED",
          applicationTimestamp: new Date().toISOString(),
        });
        fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), "utf-8");
      }
      return NextResponse.json({ success: true, id: newId }, { status: 201 });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  try {
    let fbUid: string;
    
    if (authProvider === "email") {
      const fbUser = await adminAuth.createUser({ email, password, displayName: full_name });
      fbUid = fbUser.uid;
    } else {
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
