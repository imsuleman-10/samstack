import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import type { CompanyProject } from "@/lib/firestore-schema";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(req, ["staff", "admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  const { id } = await params;

  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  try {
    const docRef = adminDb.collection(FS.COMPANY_PROJECTS).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const project = docSnap.data() as CompanyProject;

    // Staff can only delete their own projects, admins can delete any
    if (session.role === "staff" && project.user_id !== session.id) {
      return NextResponse.json({ error: "Unauthorized to delete this project" }, { status: 403 });
    }

    // Try to delete from Supabase storage (extract filename from URL)
    try {
      const urlParts = project.file_url.split('/resumes/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        const supabase = getSupabase();
        if (supabase) {
          await supabase.storage.from("resumes").remove([filePath]);
        }
      }
    } catch (storageErr) {
      console.warn("Failed to delete file from storage:", storageErr);
      // We continue to delete the DB record even if storage deletion fails
    }

    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Project delete error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete" }, { status: 500 });
  }
}
