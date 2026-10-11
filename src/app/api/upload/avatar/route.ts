import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";
import { supabaseUpload } from "@/lib/supabase";

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

    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const validExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif', 'jfif', 'bmp', 'svg'];
    const isImageMime = file.type ? file.type.startsWith('image/') : false;
    const isValidExt = validExts.includes(ext);

    if (!isImageMime && !isValidExt) {
      return NextResponse.json(
        { error: "Only image files (JPEG, PNG, WebP, GIF, HEIC) are allowed." },
        { status: 400 }
      );
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be less than 20MB." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);
    const contentType = file.type || "image/jpeg";

    // Try sharp compression — skip gracefully if unavailable (Vercel serverless)
    let finalBuffer: Buffer = rawBuffer;
    try {
      const sharp = (await import('sharp')).default;
      const meta = await sharp(rawBuffer).metadata();
      let pipeline = sharp(rawBuffer).rotate();
      if ((meta.width ?? 0) > 800) {
        pipeline = pipeline.resize({ width: 800, withoutEnlargement: true });
      }
      const compressed = await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
      if (compressed.length > 0) {
        finalBuffer = compressed;
        console.log(`[Avatar] sharp OK: ${Math.round(compressed.length / 1024)}KB`);
      }
    } catch (sharpErr: any) {
      console.warn('[Avatar] sharp skipped:', sharpErr?.message);
    }

    const sanitizedId = user.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${sanitizedId}-avatar-${Date.now()}.jpg`;
    const finalSizeKB = Math.round(finalBuffer.length / 1024);

    // Upload to Supabase Storage
    const publicUrl = await supabaseUpload({
      bucket: "avatars",
      path: fileName,
      body: finalBuffer,
      contentType,
    });

    // Save avatar_url to Firestore
    if (adminDb) {
      const now = new Date().toISOString();
      try {
        await adminDb.collection(FS.USERS).doc(user.id).set(
          { avatar_url: publicUrl, updated_at: now },
          { merge: true }
        );
      } catch (dbErr: any) {
        console.warn('[Avatar] Could not update users:', dbErr.message);
      }
      try {
        const internRef = adminDb.collection(FS.INTERN_PROFILES).doc(user.id);
        const internSnap = await internRef.get();
        if (internSnap.exists) {
          await internRef.update({ avatar_url: publicUrl, updated_at: now });
        }
      } catch (dbErr: any) {
        console.warn('[Avatar] Could not update intern_profiles:', dbErr.message);
      }
    }

    return NextResponse.json({ success: true, url: publicUrl, avatar_url: publicUrl, sizeKB: finalSizeKB });
  } catch (err: any) {
    console.error('[Avatar Upload Error]', err?.message || err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
