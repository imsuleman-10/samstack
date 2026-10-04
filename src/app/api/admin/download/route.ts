import { NextRequest, NextResponse } from "next/server";
import { db, createAdminDb } from "@/lib/db";
import { adminDb } from "@/lib/firebase-admin";
import { tracks } from "@/lib/curriculum";
import { generateOfferLetterPDF, generateCertificatePDF } from "@/lib/pdfTemplates";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });


    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get("rollNumber");
    const userId = searchParams.get("userId");
    const type = searchParams.get("type"); // "OFFER_LETTER" | "CERTIFICATE"

    if ((!rollNumber && !userId) || !["OFFER_LETTER", "CERTIFICATE"].includes(type as string)) {
      return NextResponse.json(
        { error: "Invalid identifier or type. Must provide rollNumber or userId, and type must be 'OFFER_LETTER' or 'CERTIFICATE'." },
        { status: 400 }
      );
    }

    let internFullName = "";
    let internRollNumber = "";
    let internTrackTitle = "";
    let internStatus = "";

    if (userId) {
      // 1. Modern FSUser approach
      const adb = createAdminDb(adminDb!);
      const user = await adb.users.get(userId);
      const profile = await adb.internProfiles.get(userId);

      if (!user || user.role !== "intern") {
        return NextResponse.json({ error: "Intern record not found." }, { status: 404 });
      }

      internFullName = user.full_name;
      internRollNumber = profile?.roll_number || `SAM-${userId.substring(0, 6).toUpperCase()}`;
      internTrackTitle = profile?.track_selected ? tracks[profile.track_selected]?.title || profile.track_selected : "General Specialization";
      
      const modernStatus = profile?.certificate_status === 'approved' ? 'APPROVED' : profile?.application_status;
      internStatus = modernStatus ? modernStatus.toUpperCase() : "PENDING";
      (request as any).modernProfile = profile;
    } else if (rollNumber) {
      // 2. Legacy db.interns approach
      const intern = await db.interns.get(rollNumber);
      if (!intern) {
        return NextResponse.json({ error: "Intern record not found." }, { status: 404 });
      }
      internFullName = intern.fullName;
      internRollNumber = intern.rollNumber;
      internTrackTitle = tracks[intern.trackSelected]?.title || intern.trackSelected;
      internStatus = intern.status ? intern.status.toUpperCase() : "PENDING";
    }

    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (type === "OFFER_LETTER") {
      const pdfBuffer = await generateOfferLetterPDF({
        fullName: internFullName,
        rollNumber: internRollNumber,
        track: internTrackTitle,
        date: dateStr,
      });

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="OfferLetter_${internRollNumber}.pdf"`,
        },
      });
    }

    if (type === "CERTIFICATE") {
      if (internStatus !== "APPROVED") {
        return NextResponse.json(
          { error: "Cannot download certificate — this intern has not been APPROVED yet." },
          { status: 400 }
        );
      }

      let certNumber = "";
      if (rollNumber) {
        const certificates = await db.certificates.list();
        const cert = certificates.find((c) => c.associatedRollNumber === internRollNumber);
        if (!cert) {
          return NextResponse.json(
            { error: "No certificate record found for this intern. Please approve first." },
            { status: 404 }
          );
        }
        certNumber = cert.certificateNumber;
      } else {
        const modernProfile = (request as any).modernProfile;
        certNumber = modernProfile?.certificate_id || modernProfile?.roll_number || `CERT-${userId!.substring(0, 8).toUpperCase()}`;
      }

      const pdfBuffer = await generateCertificatePDF({
        fullName: internFullName,
        certificateNumber: certNumber,
        track: internTrackTitle,
        date: dateStr,
      });

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="Certificate_${certNumber}.pdf"`,
        },
      });
    }

  } catch (error: any) {
    console.error("Download PDF error:", error);
    return NextResponse.json(
      { error: "Internal server error while generating PDF." },
      { status: 500 }
    );
  }
}
