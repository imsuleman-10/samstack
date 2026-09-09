import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import { generateCertificatePDF, generateOfferLetterPDF } from "@/lib/pdfTemplates";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["intern", "user"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    const userSnap = await adminDb.collection(FS.USERS).doc(session.id).get();
    let profileSnap = await adminDb.collection(FS.INTERN_PROFILES).doc(session.id).get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();

    // If intern profile doc does not exist yet (e.g. Google sign-in), create default
    if (!profileSnap.exists) {
      const now = new Date().toISOString();
      const defaultTrack = userData?.track || "WEB_DEV";
      const rollNumber = `SAM-WD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newProfileData = {
        user_id: session.id,
        track_selected: defaultTrack,
        roll_number: rollNumber,
        certificate_status: null,
        offer_letter_sent: false,
        created_at: now,
        updated_at: now,
      };
      await adminDb.collection(FS.INTERN_PROFILES).doc(session.id).set(newProfileData);
      profileSnap = await adminDb.collection(FS.INTERN_PROFILES).doc(session.id).get();
    }

    const profileData = profileSnap.data();

    const fullName = userData?.full_name || session.email?.split('@')[0] || "Intern";
    const track = profileData?.track_selected || userData?.track || "Web Development";
    const rollNumber = profileData?.roll_number || `SAM-IN-${session.id.slice(0, 6).toUpperCase()}`;
    const certificateId = profileData?.certificate_id || rollNumber;
    const certificateStatus = profileData?.certificate_status || "pending";
    const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    let pdfBuffer;

    if (type === 'offer_letter') {
      pdfBuffer = await generateOfferLetterPDF({
        fullName,
        rollNumber,
        track,
        date
      });
    } else if (type === 'certificate') {
      if (certificateStatus !== 'approved' && certificateStatus !== 'issued') {
        return NextResponse.json({ error: "Certificate not approved yet." }, { status: 403 });
      }
      
      pdfBuffer = await generateCertificatePDF({
        fullName,
        certificateNumber: certificateId, 
        track,
        date
      });
    } else {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${type}_${fullName.replace(/\s+/g, '_')}.pdf"`
      }
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
