import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import sharp from "sharp";
import { supabaseUpload } from "@/lib/supabase";

/**
 * Server-side compression using sharp.
 * Binary-searches JPEG quality to get the image under targetKB.
 */
async function compressToTarget(
  input: Buffer,
  targetKB = 100,
  maxWidthPx = 800
): Promise<Buffer> {
  const targetBytes = targetKB * 1024;

  let pipeline = sharp(input).rotate();
  const meta = await pipeline.metadata();
  if ((meta.width ?? 0) > maxWidthPx) {
    pipeline = pipeline.resize({ width: maxWidthPx, withoutEnlargement: true });
  }

  let lo = 20;
  let hi = 90;
  let best: Buffer | null = null;

  for (let i = 0; i < 8; i++) {
    const mid = Math.round((lo + hi) / 2);
    const candidate = await pipeline.clone().jpeg({ quality: mid, mozjpeg: true }).toBuffer();
    if (candidate.length <= targetBytes) {
      best = candidate;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  if (!best) {
    best = await pipeline.clone().jpeg({ quality: lo, mozjpeg: true }).toBuffer();
  }

  return best;
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (isAuthError(authResult)) return authResult;
  const { session: user } = authResult;

  try {
    const formData = await request.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [
      "image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, GIF or HEIC images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be less than 20MB." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // Compress server-side to ~100KB JPEG
    const compressedBuffer = await compressToTarget(rawBuffer, 100, 800);
    const finalSizeKB = Math.round(compressedBuffer.length / 1024);
    console.log(
      `[Avatar Upload] User ${user.id} — original: ${Math.round(file.size / 1024)}KB → compressed: ${finalSizeKB}KB`
    );

    const fileName = `${user.id}-avatar.jpg`;

    // Upload to Supabase Storage with auto-retry (wakes project if paused)
    const publicUrl = await supabaseUpload({
      bucket: "avatars",
      path: fileName,
      body: compressedBuffer,
      contentType: "image/jpeg",
    });

    // Save avatar_url to the platform users collection
    if (adminDb) {
      await adminDb.collection(FS.USERS).doc(user.id).update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, url: publicUrl, avatar_url: publicUrl, sizeKB: finalSizeKB });
  } catch (err: any) {
    console.error("Avatar upload error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
