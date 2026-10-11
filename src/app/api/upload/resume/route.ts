import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import { supabaseUpload } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request, ["intern", "admin"]);
  if (isAuthError(authResult)) return authResult;
  const { session: user } = authResult;

  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed for resumes." },
        { status: 400 }
      );
    }

    // Max size 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Resume must be less than 5MB." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);
    const sizeKB = Math.round(rawBuffer.length / 1024);

    const fileName = `${user.id}-resume-${Date.now()}.pdf`;

    // Upload to Supabase Storage 'resumes' bucket with auto-retry
    const publicUrl = await supabaseUpload({
      bucket: "resumes",
      path: fileName,
      body: rawBuffer,
      contentType: "application/pdf",
    });

    // Save resume_url to the intern profiles collection
    if (adminDb) {
      const now = new Date().toISOString();
      try {
        // set() with merge:true creates the doc if missing, or merges fields if existing
        await adminDb.collection(FS.INTERN_PROFILES).doc(user.id).set(
          { resume_url: publicUrl, updated_at: now },
          { merge: true }
        );
      } catch (dbErr: any) {
        console.warn('[Resume Upload] Could not update intern_profiles:', dbErr.message);
      }
    }

    console.log(`[Resume Upload] User ${user.id} uploaded resume: ${sizeKB}KB`);

    return NextResponse.json({ success: true, url: publicUrl, resume_url: publicUrl, sizeKB });
  } catch (err: any) {
    console.error('Resume upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
