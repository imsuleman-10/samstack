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

  // Validate buffer is not empty/corrupt before passing to sharp
  if (!input || input.length < 10) {
    throw new Error('Input buffer is too small or empty');
  }

  let pipeline: ReturnType<typeof sharp>;
  try {
    pipeline = sharp(input).rotate();
    const meta = await pipeline.metadata();
    if ((meta.width ?? 0) > maxWidthPx) {
      pipeline = pipeline.resize({ width: maxWidthPx, withoutEnlargement: true });
    }
  } catch (metaErr: any) {
    throw new Error(`Sharp metadata error: ${metaErr?.message}`);
  }

  let lo = 20;
  let hi = 90;
  let best: Buffer | null = null;

  for (let i = 0; i < 8; i++) {
    const mid = Math.round((lo + hi) / 2);
    try {
      const candidate = await pipeline.clone().jpeg({ quality: mid, mozjpeg: true }).toBuffer();
      if (candidate.length <= targetBytes) {
        best = candidate;
        lo = mid;
      } else {
        hi = mid;
      }
    } catch {
      break; // Stop iteration on encode error, use what we have
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

    let finalBuffer: Buffer = rawBuffer;
    let contentType = file.type || "image/jpeg";
    try {
      finalBuffer = await compressToTarget(rawBuffer, 100, 800);
      contentType = "image/jpeg";
      console.log(`[Avatar Upload] Sharp compression OK — ${Math.round(finalBuffer.length / 1024)}KB`);
    } catch (sharpErr: any) {
      console.warn('[Avatar Upload] Sharp compression skipped, using original buffer:', sharpErr?.message);
      // Use original buffer with original content type — upload still proceeds
      finalBuffer = rawBuffer;
    }

    const finalSizeKB = Math.round(finalBuffer.length / 1024);
    const sanitizedId = user.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${sanitizedId}-avatar-${Date.now()}.jpg`;

    // Upload to Supabase Storage with auto-retry and local fallback
    const publicUrl = await supabaseUpload({
      bucket: "avatars",
      path: fileName,
      body: finalBuffer,
      contentType,
    });

    // Save avatar_url to the platform users collection
    if (adminDb) {
      const now = new Date().toISOString();
      // Use set() with merge:true — this creates doc if not exists, or merges if it does
      try {
        await adminDb.collection(FS.USERS).doc(user.id).set(
          { avatar_url: publicUrl, updated_at: now },
          { merge: true }
        );
      } catch (dbErr: any) {
        console.warn('[Avatar Upload] Could not update users collection:', dbErr.message);
      }
      try {
        // Only update intern_profiles if document already exists
        const internRef = adminDb.collection(FS.INTERN_PROFILES).doc(user.id);
        const internSnap = await internRef.get();
        if (internSnap.exists) {
          await internRef.update({ avatar_url: publicUrl, updated_at: now });
        }
      } catch (dbErr: any) {
        console.warn('[Avatar Upload] Could not update intern_profiles:', dbErr.message);
      }
    }

    return NextResponse.json({ success: true, url: publicUrl, avatar_url: publicUrl, sizeKB: finalSizeKB });
  } catch (err: any) {
    console.error('Avatar upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
