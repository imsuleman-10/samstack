import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import { generateCertificatePDF } from "@/lib/pdfTemplates";

export async function GET(req: NextRequest) {
  try {
    // Only logged in users
    const auth = await requireAuth(req, ["intern", "user", "admin", "staff", "mentor"]);
    if (isAuthError(auth)) return auth;

    const { session } = auth;
    const userId = session.id;

    if (!adminDb) return NextResponse.json({ error: "DB not initialized" }, { status: 500 });

    // Get User and Profile
    const userSnap = await adminDb.collection(FS.USERS).doc(userId).get();
    if (!userSnap.exists) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const user = userSnap.data();

    const internSnap = await adminDb.collection(FS.INTERN_PROFILES).doc(userId).get();
    if (!internSnap.exists) {
      return NextResponse.json({ error: "Intern profile not found." }, { status: 404 });
    }
    const internProfile = internSnap.data();

    // Verification: Certificate is only available if they have been approved/certified.
    if (internProfile?.certificate_status !== 'approved' && internProfile?.certificate_status !== 'issued') {
      return NextResponse.json({ error: "Certificate is not yet available. It will be unlocked once you are approved and certified by the administration." }, { status: 403 });
    }

    const certificateId = internProfile?.certificate_id || internProfile.roll_number || 'PENDING';
    const track = internProfile?.track_title || 'Software Engineering Internship';
    
    // Formatting date - Use certified date or today
    const dateStr = internProfile?.certified_at 
      ? new Date(internProfile.certified_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
      : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    // Generate PDF
    const pdfBuffer = await generateCertificatePDF({
      fullName: user?.full_name || 'Candidate',
      certificateNumber: certificateId,
      track: track,
      date: dateStr,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="SAMStack_Certificate_${user?.full_name?.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("Certificate API Error:", error);
    return NextResponse.json({ error: "Failed to generate certificate." }, { status: 500 });
  }
}
