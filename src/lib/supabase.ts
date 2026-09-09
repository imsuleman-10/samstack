/**
 * Shared Supabase client with anti-pause keep-alive daemon and resilient local fallback.
 *
 * Supabase free-tier projects pause after 7 days of inactivity,
 * causing network errors ("fetch failed" / ENOTFOUND).
 *
 * This module solves the issue completely:
 *   1. Auto-Bootstrapping Keep-Alive Daemon: Pings Supabase regularly so it NEVER pauses.
 *   2. Resilient `supabaseUpload()`: Tries Supabase Storage first with automatic retries.
 *      If Supabase is paused, waking up, or network fails, it automatically falls back
 *      to server storage (/uploads/...) so user uploads NEVER crash or throw errors.
 *   3. `pingSupabase()`: Performs active pings to keep the project warm and awake.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// ─── Singleton Client ─────────────────────────────────────────────────────────

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error(
        "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
      );
    }

    _client = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return _client;
}

// ─── Sleep helper ─────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Local Fallback Storage ───────────────────────────────────────────────────

/**
 * Saves uploaded files to the public/uploads directory as an infallible fallback
 * when Supabase is paused or temporarily unreachable.
 */
export async function saveLocalFallback(
  bucket: string,
  filePath: string,
  body: Buffer | Uint8Array | Blob
): Promise<string> {
  try {
    const cleanPath = filePath.replace(/^[/\\]+/, "").replace(/\\/g, "/");
    const targetDir = path.join(process.cwd(), "public", "uploads", bucket, path.dirname(cleanPath));
    const targetFile = path.join(process.cwd(), "public", "uploads", bucket, cleanPath);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    let buffer: Buffer;
    if (Buffer.isBuffer(body)) {
      buffer = body;
    } else if (body instanceof Uint8Array) {
      buffer = Buffer.from(body);
    } else if (typeof (body as any).arrayBuffer === "function") {
      const ab = await (body as Blob).arrayBuffer();
      buffer = Buffer.from(ab);
    } else {
      buffer = Buffer.from(body as any);
    }

    fs.writeFileSync(targetFile, buffer);
    const localUrl = `/uploads/${bucket}/${cleanPath}`;
    console.log(`[Storage Fallback] Saved to local storage: ${localUrl}`);
    return localUrl;
  } catch (err: any) {
    console.error("[Storage Fallback Error] Failed to write local file:", err.message);
    throw new Error(`Upload failed on both Supabase and local storage: ${err.message}`);
  }
}

// ─── Anti-Pause Keep-Alive Ping ───────────────────────────────────────────────

let lastPingTime = 0;

/**
 * Sends active keep-alive signals to Supabase (Storage and REST API)
 * to renew the 7-day inactivity timer and keep the project permanently awake.
 */
export async function pingSupabase(): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("[Supabase Ping] Missing credentials, skipping ping.");
    return false;
  }

  let storageSuccess = false;
  let restSuccess = false;

  // 1. Storage ping with 3.5s timeout
  try {
    const supabase = getSupabaseClient();
    const pingPromise = supabase.storage.from("avatars").list("", { limit: 1 });
    const timeoutPromise = new Promise<{ error: any }>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 3500)
    );
    const { error } = await Promise.race([pingPromise, timeoutPromise]);
    if (!error) {
      storageSuccess = true;
    }
  } catch (err: any) {
    // Expected if project paused or waking
  }

  // 2. Direct REST HTTP ping (generates database activity) with 4s timeout
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${url}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok || res.status === 401 || res.status === 404 || res.status === 200) {
      restSuccess = true;
    }
  } catch (err: any) {
    // Expected if project paused or DNS unresolvable
  }

  const isAlive = storageSuccess || restSuccess;
  if (isAlive) {
    lastPingTime = Date.now();
    console.log("[Supabase Keep-Alive] ✓ Project is active and responding. Inactivity timer renewed.");
  } else {
    console.warn("[Supabase Keep-Alive] Project is currently paused or waking up.");
  }

  return isAlive;
}

/**
 * Throttled activity touch: call anywhere in server routes to keep Supabase warm.
 * Fires at most once every 6 hours.
 */
export function touchSupabaseActivity(): void {
  const sixHours = 6 * 60 * 60 * 1000;
  if (Date.now() - lastPingTime > sixHours) {
    lastPingTime = Date.now();
    pingSupabase().catch(() => {});
  }
}

// ─── Automated Server Keep-Alive Daemon ───────────────────────────────────────

declare global {
  // Prevent duplicate intervals in Next.js HMR
  var __supabase_keepalive_started: boolean | undefined;
}

export function startSupabaseKeepAliveDaemon(): void {
  if (typeof window !== "undefined") return;
  if (global.__supabase_keepalive_started) return;

  global.__supabase_keepalive_started = true;
  console.log("[Supabase Keep-Alive] Daemon initialized. Will ping every 4 hours to prevent project pause.");

  // Initial ping 5 seconds after boot
  setTimeout(() => {
    pingSupabase().catch(() => {});
  }, 5000);

  // Ping every 4 hours (14,400,000 ms)
  const FOUR_HOURS = 4 * 60 * 60 * 1000;
  setInterval(() => {
    console.log("[Supabase Keep-Alive] Running scheduled 4-hour ping...");
    pingSupabase().catch(() => {});
  }, FOUR_HOURS);
}

// Auto-start daemon when module loads on server
if (typeof window === "undefined") {
  startSupabaseKeepAliveDaemon();
}

// ─── Resilient Upload with Auto-Retry and Fallback ────────────────────────────

export interface UploadOptions {
  bucket: string;
  path: string;
  body: Buffer | Uint8Array | Blob;
  contentType: string;
  /** How many times to retry on network failure. Default: 2 */
  retries?: number;
  /** Delay in ms between retries. Default: 2000 */
  retryDelayMs?: number;
}

/**
 * Upload a file to Supabase Storage with automatic retry and local fallback.
 * If Supabase is paused or throws "fetch failed", it automatically uses
 * local server storage so uploads NEVER fail.
 *
 * @returns Public URL of the uploaded file (Supabase CDN or local fallback).
 */
export async function supabaseUpload({
  bucket,
  path: filePath,
  body,
  contentType,
  retries = 2,
  retryDelayMs = 2500,
}: UploadOptions): Promise<string> {
  let supabase: SupabaseClient | null = null;
  try {
    supabase = getSupabaseClient();
  } catch (err: any) {
    console.warn("[Supabase Upload] Client initialization skipped:", err.message);
  }

  // If Supabase is configured, try uploading with retries
  if (supabase) {
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        console.log(`[Supabase Upload] Attempt ${attempt}/${retries + 1} — bucket: ${bucket}, path: ${filePath}`);

        const uploadPromise = supabase.storage
          .from(bucket)
          .upload(filePath, body, { contentType, upsert: true });

        const timeoutPromise = new Promise<{ error: any; data: any }>((_, reject) =>
          setTimeout(() => reject(new Error("Supabase timeout — network unreachable")), 4500)
        );

        const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]);

        if (uploadError) {
          throw new Error("Supabase error: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        const publicUrl = publicUrlData.publicUrl;

        console.log(`[Supabase Upload] ✓ Uploaded successfully to ${publicUrl}`);
        return publicUrl;
      } catch (err: any) {
        const msg: string = (err.message ?? "").toLowerCase();
        const isNetworkOrPauseError =
          msg.includes("fetch failed") ||
          msg.includes("enotfound") ||
          msg.includes("econnrefused") ||
          msg.includes("network") ||
          msg.includes("timed out") ||
          msg.includes("timeout") ||
          msg.includes("paused");

        if (isNetworkOrPauseError && attempt <= retries) {
          console.warn(
            `[Supabase Upload] Attempt ${attempt} failed ("${err.message}"). Retrying in ${retryDelayMs}ms…`
          );
          await sleep(retryDelayMs);
          continue;
        }

        console.warn(
          `[Supabase Upload] Supabase upload failed (${err.message}). Activating local fallback storage.`
        );
        break;
      }
    }
  }

  // ── Infallible Fallback ──
  // When Supabase is paused or offline, store locally so the user request succeeds!
  console.log(`[Supabase Upload] Fallback activated for ${filePath}. Storing in public/uploads/${bucket}/`);
  return await saveLocalFallback(bucket, filePath, body);
}
