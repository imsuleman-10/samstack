import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import { generateUniqueCertificateId } from "@/lib/certificate";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req, ["admin"]);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  const { action } = await req.json();

  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && adminDb) {
    if (action === "approve") {
      try {
        const now = new Date().toISOString();
        const certificateId = await generateUniqueCertificateId(adminDb);
        
        await adminDb.collection(FS.INTERN_PROFILES).doc(id).set(
          { 
            certificate_status: 'approved',
            certificate_id: certificateId,
            updated_at: now
          },
          { merge: true }
        );
        
        const notifId = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await adminDb.collection(FS.NOTIFICATIONS).doc(notifId).set({
          id: notifId,
          user_id: id,
          type: "certificate_approved",
          title: "Certificate Approved",
          message: "Your certificate request has been approved. You can now download it from your dashboard.",
          is_read: false,
          created_at: now
        });

        return NextResponse.json({ success: true, message: "Certificate approved", certificate_id: certificateId });
      } catch (err: any) {
        console.warn("[admin/certificate] Firestore error, trying local fallback:", err.message);
      }
    }

    if (action === "reject") {
      try {
        const now = new Date().toISOString();
        await adminDb.collection(FS.INTERN_PROFILES).doc(id).set(
          { certificate_status: 'rejected', updated_at: now },
          { merge: true }
        );
        const notifId = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await adminDb.collection(FS.NOTIFICATIONS).doc(notifId).set({
          id: notifId,
          user_id: id,
          type: "certificate_rejected",
          title: "Certificate Request Rejected",
          message: "Your certificate request has been reviewed and was not approved at this time. Please contact your mentor for more details.",
          is_read: false,
          created_at: now,
        });
        return NextResponse.json({ success: true, message: "Certificate request rejected" });
      } catch (err: any) {
        console.warn("[admin/certificate] Firestore error, trying local fallback:", err.message);
      }
    }
  }

  // Local database fallback for development
  try {
    const dbPath = path.join(process.cwd(), ".data", "db.json");
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: "Local DB not found" }, { status: 404 });
    }
    const dbData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    dbData.interns = dbData.interns || [];
    const intern = dbData.interns.find((i: any) => i.id === id);

    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    if (action === "approve") {
      intern.status = "APPROVED";
      const certId = `SAM-CERT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      dbData.certificates = dbData.certificates || [];
      dbData.certificates.push({
        certificateNumber: certId,
        associatedRollNumber: intern.rollNumber || "SAM-2026-0001",
        recipientName: intern.fullName,
        trackTitle: intern.trackSelected || "Full Stack Software Engineering",
        issuanceDate: new Date().toISOString(),
        isValid: true,
      });
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), "utf-8");
      return NextResponse.json({ success: true, message: "Certificate approved", certificate_id: certId });
    }

    if (action === "reject") {
      intern.status = "REJECTED";
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), "utf-8");
      return NextResponse.json({ success: true, message: "Certificate request rejected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
