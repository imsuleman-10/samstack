import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import type { CompanyProject } from "@/lib/firestore-schema";
import { supabaseUpload } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

// GET /api/staff-projects - Get all projects for the logged-in staff member
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["staff", "admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  try {
    const snap = await adminDb
      .collection(FS.COMPANY_PROJECTS)
      .where("user_id", "==", session.id)
      .orderBy("created_at", "desc")
      .get();

    const projects = snap.docs.map(doc => doc.data() as CompanyProject);
    return NextResponse.json({ projects });
  } catch (err: any) {
    // If index is missing, fallback to unordered
    console.warn("Index missing for company_projects:", err.message);
    const snap = await adminDb
      .collection(FS.COMPANY_PROJECTS)
      .where("user_id", "==", session.id)
      .get();
    
    const projects = snap.docs.map(doc => doc.data() as CompanyProject)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    
    return NextResponse.json({ projects });
  }
}

// POST /api/staff-projects - Upload a new project file
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ["staff", "admin"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;

  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit for projects
      return NextResponse.json({ error: "File must be less than 10MB." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);
    const ext = file.name.split('.').pop() || 'bin';
    const fileName = `projects/${session.id}-${Date.now()}.${ext}`;

    // Upload to 'resumes' bucket with auto-retry and local fallback
    const publicUrl = await supabaseUpload({
      bucket: "resumes",
      path: fileName,
      body: rawBuffer,
      contentType: file.type || "application/octet-stream",
    });

    const newProject: CompanyProject = {
      id: uuidv4(),
      user_id: session.id,
      file_name: file.name,
      file_url: publicUrl,
      file_size: file.size,
      created_at: new Date().toISOString(),
    };

    await adminDb.collection(FS.COMPANY_PROJECTS).doc(newProject.id).set(newProject);

    return NextResponse.json({ success: true, project: newProject });
  } catch (err: any) {
    console.error("Project upload error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
