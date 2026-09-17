import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { tracks } from "@/lib/curriculum";
import { generateCertificatePDF } from "@/lib/pdfTemplates";
import { sendCertificateEmail } from "@/lib/mailer";
import crypto from "crypto";

export const maxDuration = 60; // Set max duration to 60 seconds for Vercel Serverless

export async function POST(request: NextRequest) {
  // Require admin authentication
  const auth = await requireAuth(request, ["admin"]);
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const { fullName, email, university, trackSelected } = body;

    if (!fullName || !university || !trackSelected) {
      return NextResponse.json(
        { error: "Missing required fields (Name, University, Track)." },
        { status: 400 }
      );
    }

    if (!adminDb) {
      throw new Error("Firebase Admin not initialized.");
    }

    // 1. Generate unique sequence & roll number using admin transaction
    const counterRef = adminDb.collection("counters").doc("global");
    const nextSeq = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(counterRef);
      const current = snap.exists ? (snap.data()?.lastAssignedSequence as number) : 0;
      const next = current + 1;
      tx.set(counterRef, { lastAssignedSequence: next }, { merge: true });
      return next;
    });

    const rollNumber = `SAM-2026-${String(nextSeq).padStart(4, '0')}`;
    const internId = `intern-${Date.now()}-${crypto.randomBytes(5).toString('hex')}`;

    const newIntern = {
      id: internId,
      fullName,
      email: email ? email.toLowerCase() : "",
      university,
      trackSelected,
      rollNumber,
      applicationTimestamp: new Date().toISOString(),
      status: 'APPROVED',
      submissionData: null,
    };

    // 2. Create the legacy intern record
    await adminDb.collection("interns").doc(internId).set(newIntern);

    // 3. Generate unique certificate ID
    const certHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    const certificateNumber = `SAM-CERT-2026-${certHex}`;

    // 4. Resolve track title
    const trackTitle = tracks[newIntern.trackSelected as keyof typeof tracks]?.title || `${newIntern.trackSelected} Specialization`;

    // 5. Persist certificate in DB
    await adminDb.collection("certificates").doc(certificateNumber).set({
      certificateNumber,
      associatedRollNumber: newIntern.rollNumber,
      recipientName: newIntern.fullName,
      trackTitle,
      issuanceDate: new Date().toISOString(),
      isValid: true,
    });

    console.log(`[FIREBASE] INSTANT_CERT_GENERATED: ${newIntern.rollNumber} — cert ${certificateNumber}`);

    // Asynchronously generate and send certificate
    const processCertificate = async () => {
      try {
        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const pdfBuffer = await generateCertificatePDF({
          fullName: newIntern.fullName,
          certificateNumber,
          track: trackTitle,
          date: dateStr,
        });

        if (newIntern.email && newIntern.email.trim() !== "") {
          await sendCertificateEmail(
            newIntern.email,
            newIntern.fullName,
            certificateNumber,
            trackTitle,
            pdfBuffer
          );
          console.log(`[MAILER] Instant certificate sent to ${newIntern.email}`);
        } else {
          console.log(`[MAILER] Instant certificate generated but no email provided for ${newIntern.fullName}`);
        }
      } catch (err) {
        console.error(`[MAILER] Failed to process instant certificate`, err);
      }
    };

    await processCertificate();

    return NextResponse.json({
      success: true,
      message: `Intern ${fullName} added and certificate ${certificateNumber} issued instantly.`,
      intern: newIntern,
      certificateNumber
    });
  } catch (error: any) {
    console.error("Add and certify intern error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
