import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { tracks } from "@/lib/curriculum";
import { generateOfferLetterPDF, generateCertificatePDF } from "@/lib/pdfTemplates";
import { sendOfferLetterEmail, sendCertificateEmail } from "@/lib/mailer";
import { verifyAdminSession } from "@/lib/adminAuth";
import crypto from "crypto";

/**
 * POST /api/admin/send-direct
 *
 * Bypasses all status checks. Admin can send an offer letter OR a certificate
 * to ANY intern at any time — no submission or approval required.
 *
 * Body: { rollNumber: string, type: "OFFER_LETTER" | "CERTIFICATE" }
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await request.json();
    const { rollNumber, type } = body;

    if (!rollNumber || !["OFFER_LETTER", "CERTIFICATE"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid request. Provide rollNumber and type ('OFFER_LETTER' | 'CERTIFICATE')." },
        { status: 400 }
      );
    }

    if (!adminDb) return NextResponse.json({ error: "DB not initialized" }, { status: 500 });

    const internSnap = await adminDb.collection("interns").where("rollNumber", "==", rollNumber).limit(1).get();
    if (internSnap.empty) {
      return NextResponse.json({ error: `Intern with roll number ${rollNumber} not found.` }, { status: 404 });
    }
    const internDoc = internSnap.docs[0];
    const intern = internDoc.data();

    const trackTitle = tracks[intern.trackSelected]?.title || intern.trackSelected;
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // ── DIRECT OFFER LETTER ─────────────────────────────────────────
    if (type === "OFFER_LETTER") {
      const pdfBuffer = await generateOfferLetterPDF({
        fullName: intern.fullName,
        rollNumber: intern.rollNumber,
        track: trackTitle,
        date: dateStr,
      });

      await sendOfferLetterEmail(
        intern.email,
        intern.fullName,
        intern.rollNumber,
        trackTitle,
        pdfBuffer
      );

      console.log(`[ADMIN] Direct offer letter sent to ${intern.email} (${intern.rollNumber})`);

      return NextResponse.json({
        success: true,
        message: `Offer letter sent directly to ${intern.fullName} (${intern.email}).`,
      });
    }

    // ── DIRECT CERTIFICATE ──────────────────────────────────────────
    if (type === "CERTIFICATE") {
      // Check if a certificate already exists for this intern
      const certsSnap = await adminDb.collection("certificates").where("associatedRollNumber", "==", intern.rollNumber).limit(1).get();
      let cert = certsSnap.empty ? null : certsSnap.docs[0].data();

      if (!cert) {
        // Auto-generate a new certificate record (no approval needed)
        const certHex = crypto.randomBytes(4).toString('hex').toUpperCase();
        const certificateNumber = `SAM-CERT-2026-${certHex}`;

        cert = {
          certificateNumber,
          associatedRollNumber: intern.rollNumber,
          recipientName: intern.fullName,
          trackTitle,
          issuanceDate: new Date().toISOString(),
          isValid: true,
        };
        await adminDb.collection("certificates").doc(certificateNumber).set(cert);

        // Also upgrade intern status to APPROVED so cert is discoverable
        await internDoc.ref.update({ status: "APPROVED" });

        console.log(`[ADMIN] Certificate auto-created: ${certificateNumber} for ${intern.rollNumber}`);
      }

      const pdfBuffer = await generateCertificatePDF({
        fullName: intern.fullName,
        certificateNumber: cert.certificateNumber,
        track: trackTitle,
        date: dateStr,
      });

      await sendCertificateEmail(
        intern.email,
        intern.fullName,
        cert.certificateNumber,
        trackTitle,
        pdfBuffer
      );

      console.log(`[ADMIN] Direct certificate sent to ${intern.email} (${cert.certificateNumber})`);

      return NextResponse.json({
        success: true,
        message: `Certificate (${cert.certificateNumber}) sent directly to ${intern.fullName} (${intern.email}).`,
        certificateNumber: cert.certificateNumber,
      });
    }
  } catch (error: any) {
    console.error("[ADMIN] Direct send error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error during direct send." },
      { status: 500 }
    );
  }
}
