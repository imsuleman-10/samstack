import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { tracks } from "@/lib/curriculum";
import { generateOfferLetterPDF, generateCertificatePDF } from "@/lib/pdfTemplates";
import { sendOfferLetterEmail, sendCertificateEmail } from "@/lib/mailer";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await request.json();
    const { rollNumber, type } = body; // type: "OFFER_LETTER" | "CERTIFICATE"

    if (!rollNumber || !["OFFER_LETTER", "CERTIFICATE"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid rollNumber or type. Must be 'OFFER_LETTER' or 'CERTIFICATE'." },
        { status: 400 }
      );
    }

    if (!adminDb) return NextResponse.json({ error: "DB not initialized" }, { status: 500 });

    // Fetch intern record
    const internSnap = await adminDb.collection("interns").where("rollNumber", "==", rollNumber).limit(1).get();
    if (internSnap.empty) {
      return NextResponse.json({ error: "Intern record not found." }, { status: 404 });
    }
    const intern = internSnap.docs[0].data();

    const trackTitle = tracks[intern.trackSelected]?.title || intern.trackSelected;
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // ── RESEND OFFER LETTER ──────────────────────────────────────
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

      console.log(`[MAILER] Offer letter RESENT to ${intern.email} (${intern.rollNumber})`);

      return NextResponse.json({
        success: true,
        message: `Offer letter successfully resent to ${intern.email}.`,
      });
    }

    // ── RESEND CERTIFICATE ───────────────────────────────────────
    if (type === "CERTIFICATE") {
      if (intern.status !== "APPROVED") {
        return NextResponse.json(
          { error: "Cannot send certificate — this intern has not been APPROVED yet." },
          { status: 400 }
        );
      }

      // Look up the certificate record
      const certSnap = await adminDb.collection("certificates").where("associatedRollNumber", "==", intern.rollNumber).limit(1).get();
      if (certSnap.empty) {
        return NextResponse.json(
          { error: "No certificate record found for this intern. Please approve first." },
          { status: 404 }
        );
      }
      const cert = certSnap.docs[0].data();

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

      console.log(`[MAILER] Certificate RESENT to ${intern.email} (${cert.certificateNumber})`);

      return NextResponse.json({
        success: true,
        message: `Certificate (${cert.certificateNumber}) successfully resent to ${intern.email}.`,
      });
    }
    // Should never reach here given the type validation above
    return NextResponse.json({ error: "Invalid request type." }, { status: 400 });
  } catch (error) {
    console.error("Resend email error:", error);
    return NextResponse.json(
      { error: "Internal server error while resending email." },
      { status: 500 }
    );
  }
}
