import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import fs from "fs";
import path from "path";

function getLocalCertificatesFallback(statusFilter?: string | null) {
  let interns: any[] = [];
  try {
    const dbPath = path.join(process.cwd(), ".data", "db.json");
    if (fs.existsSync(dbPath)) {
      const raw = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      interns = raw.interns || [];
    }
  } catch (e) {
    console.warn("[certificates] Fallback read error:", e);
  }

  const allRequests = interns.map((i) => {
    const certStatus =
      i.status === "APPROVED" ? "approved" : i.status === "SUBMITTED" ? "pending" : "pending";
    return {
      intern_id: i.id,
      full_name: i.fullName || "Intern",
      email: i.email || null,
      avatar_url: null,
      roll_number: i.rollNumber || "SAM-2026-0001",
      track_selected: i.trackSelected || "MERN",
      certificate_status: certStatus,
      certificate_id: i.status === "APPROVED" ? `SAM-CERT-${i.id.slice(-6).toUpperCase()}` : null,
      updated_at: i.submissionData?.submissionTimestamp || i.applicationTimestamp || new Date().toISOString(),
      joining_date: i.applicationTimestamp || null,
      university: i.university || "Not Specified",
      department: i.trackSelected || "Engineering",
    };
  });

  const filtered = statusFilter && statusFilter !== 'all'
    ? allRequests.filter(r => r.certificate_status === statusFilter)
    : allRequests;

  filtered.sort((a, b) => (b.updated_at || "").localeCompare(a.updated_at || ""));

  const summary = {
    pending: allRequests.filter((r) => r.certificate_status === "pending").length,
    approved: allRequests.filter((r) => r.certificate_status === "approved").length,
    rejected: allRequests.filter((r) => r.certificate_status === "rejected").length,
  };

  return { requests: filtered, summary };
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["admin", "mentor", "staff"]);
  if (isAuthError(auth)) return auth;

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status");

  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && adminDb) {
    try {
      const profilesSnap = await adminDb.collection(FS.INTERN_PROFILES).get();

      if (profilesSnap.empty) {
        return NextResponse.json({ requests: [], summary: { pending: 0, approved: 0, rejected: 0 } });
      }

      const docs = profilesSnap.docs.filter((doc) => {
        const status = doc.data().certificate_status;
        if (!status) return false;
        if (statusFilter && statusFilter !== 'all') return status === statusFilter;
        return ['pending', 'approved', 'rejected'].includes(status);
      });

      if (docs.length === 0) {
        return NextResponse.json({ requests: [], summary: { pending: 0, approved: 0, rejected: 0 } });
      }

      const userIds = docs.map((d) => d.id);
      const userFetches = userIds.map((uid) =>
        adminDb!.collection(FS.USERS).doc(uid).get()
      );
      const userSnaps = await Promise.all(userFetches);

      const requests = docs.map((profileDoc, i) => {
        const profile = profileDoc.data();
        const user = userSnaps[i].data();
        return {
          intern_id: profileDoc.id,
          full_name: user?.full_name || "Unknown",
          email: user?.email || null,
          avatar_url: user?.avatar_url || null,
          roll_number: profile.roll_number || null,
          track_selected: profile.track_selected || null,
          certificate_status: profile.certificate_status,
          certificate_id: profile.certificate_id || null,
          updated_at: profile.updated_at,
          joining_date: profile.joining_date || null,
          university: profile.university || null,
          department: profile.department || null,
        };
      });

      requests.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));

      const summary = {
        pending: requests.filter((r) => r.certificate_status === "pending").length,
        approved: requests.filter((r) => r.certificate_status === "approved").length,
        rejected: requests.filter((r) => r.certificate_status === "rejected").length,
      };

      return NextResponse.json({ requests, summary });
    } catch (err: any) {
      console.warn("[admin/certificates] Firestore error, falling back to local data:", err.message);
    }
  }

  // Graceful fallback for local development
  return NextResponse.json(getLocalCertificatesFallback(statusFilter));
}
