import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import { generateOfferLetterPDF } from "@/lib/pdfTemplates";

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

    let internSnap = await adminDb.collection(FS.INTERN_PROFILES).doc(userId).get();
    if (!internSnap.exists) {
      // Auto-create intern profile for user
      const now = new Date().toISOString();
      const rollNumber = `SAM-WD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
      await adminDb.collection(FS.INTERN_PROFILES).doc(userId).set({
        user_id: userId,
        track_selected: user?.track || "WEB_DEV",
        roll_number: rollNumber,
        certificate_status: null,
        offer_letter_sent: false,
        created_at: now,
        updated_at: now,
      });
      await adminDb.collection(FS.USERS).doc(userId).update({ role: 'intern' }).catch(() => {});
      internSnap = await adminDb.collection(FS.INTERN_PROFILES).doc(userId).get();
    }
    const internProfile = internSnap.data();

    // In SAMStack, interns might not have a roll number until certified, but offer letter requires one.
    // If they don't have one, we can generate a temporary reference or just "TBD" if they aren't approved yet.
    // But since they are an intern, they usually have an application record. We'll use their application ID or 'PENDING-APPROVAL' if not set.
    const rollNumber = internProfile?.roll_number || `APP-${userId.slice(0,6).toUpperCase()}`;

    // Get Track from their profile, default to 'Software Engineering'
    const track = internProfile?.track_title || 'Software Engineering Internship';
    
    // Formatting date
    const dateStr = user?.created_at 
      ? new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
      : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    // Generate PDF
    const pdfBuffer = await generateOfferLetterPDF({
      fullName: user?.full_name || 'Candidate',
      rollNumber: rollNumber,
      track: track,
      date: dateStr,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="SAMStack_Offer_Letter_${user?.full_name?.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("Offer Letter API Error:", error);
    return NextResponse.json({ error: "Failed to generate offer letter." }, { status: 500 });
  }
}
