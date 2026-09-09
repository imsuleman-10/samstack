import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/lib/firebase-admin";
export const dynamic = "force-dynamic";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { supabaseUpload } from "@/lib/supabase";

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("CRITICAL: JWT_SECRET is not defined.");
  return new TextEncoder().encode(secret);
};

async function getSessionUser() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("admin_token")?.value ||
    cookieStore.get("user_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as { id: string; role: string };
  } catch {
    return null;
  }
}

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (!adminDb) {
    return NextResponse.json({ error: "Firebase DB not initialized" }, { status: 500 });
  }

  try {
    const teamSnapshot = await adminDb.collection("homepage_team").orderBy("display_order", "asc").get();
    const team = teamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const staffRoles = ["mentor", "admin", "support", "staff"];
    const staffSnapshot = await adminDb.collection("users").where("role", "in", staffRoles).get();
    const availableStaff = staffSnapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, full_name: data.full_name, role: data.role, image_url: data.image_url };
    });

    return NextResponse.json({ team, availableStaff });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!adminDb || !adminStorage) {
    return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
  }

  const formData = await req.formData();
  const targetUserId  = formData.get("user_id") as string;
  const name          = formData.get("name") as string;
  const designation   = formData.get("designation") as string;
  const bio           = formData.get("bio") as string || "";
  const badge         = formData.get("badge") as string || "";
  const skills        = formData.get("skills") as string || "[]";
  const file          = formData.get("file") as File | null;
  const isActiveStr   = formData.get("is_active") as string;
  const isActive      = isActiveStr === "true";

  if (!targetUserId || !name || !designation) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let image_url: string | undefined = undefined;

  if (file && file.size > 0) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `team/${targetUserId}-team.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadedUrl = await supabaseUpload({
      bucket: "avatars",
      path,
      body: buffer,
      contentType: file.type || "image/jpeg",
    });
      
    image_url = `${uploadedUrl}?t=${Date.now()}`;
  }

  const teamRef = adminDb.collection("homepage_team");
  const existingQuery = await teamRef.where("user_id", "==", targetUserId).limit(1).get();
  
  const payload: any = {
    user_id: targetUserId,
    name,
    designation,
    bio,
    badge,
    skills: JSON.parse(skills),
    is_active: isActive,
  };

  if (image_url) {
    payload.image_url = image_url;
  } else if (existingQuery.empty) {
    payload.image_url = ""; 
  }

  if (!existingQuery.empty) {
    const existingDoc = existingQuery.docs[0];
    await existingDoc.ref.update(payload);
  } else {
    // Determine the next display order
    const allItems = await teamRef.orderBy("display_order", "desc").limit(1).get();
    const nextOrder = !allItems.empty ? (allItems.docs[0].data().display_order || 0) + 1 : 1;
    payload.display_order = nextOrder;

    await teamRef.add(payload);
  }

  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!adminDb) return NextResponse.json({ error: "Firebase DB not initialized" }, { status: 500 });

  try {
    const body = await req.json();
    const orderedIds = body.orderedIds as string[];

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const batch = adminDb.batch();
    for (let i = 0; i < orderedIds.length; i++) {
      const docRef = adminDb.collection("homepage_team").doc(orderedIds[i]);
      batch.update(docRef, { display_order: i + 1 });
    }
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (!adminDb) return NextResponse.json({ error: "Firebase DB not initialized" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await adminDb.collection("homepage_team").doc(id).delete();
  return NextResponse.json({ success: true });
}

