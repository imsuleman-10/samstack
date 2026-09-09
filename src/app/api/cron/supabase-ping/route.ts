/**
 * GET /api/cron/supabase-ping
 *
 * Dedicated keep-alive endpoint for the Supabase project.
 * Scheduled via Vercel Cron (vercel.json) or external services
 * to ensure Supabase NEVER pauses due to 7 days of inactivity.
 */

import { NextRequest, NextResponse } from "next/server";
import { pingSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Allow if called by Vercel Cron
  const isVercelCron = request.headers.get("x-vercel-cron") !== null;

  // Security check if CRON_SECRET is configured
  const secret = process.env.CRON_SECRET;
  if (secret && !isVercelCron) {
    const authHeader = request.headers.get("authorization");
    const queryKey = request.nextUrl.searchParams.get("key");
    const isAuthorized =
      authHeader === `Bearer ${secret}` || queryKey === secret;

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const start = Date.now();
  const alive = await pingSupabase();
  const latencyMs = Date.now() - start;

  if (!alive) {
    return NextResponse.json(
      {
        ok: false,
        message: "Supabase ping returned failure — project is either paused or resolving DNS. If paused, restore from Supabase dashboard.",
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      { status: 200 } // Return 200 to prevent Vercel cron from failing completely
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Supabase is alive and active. Inactivity timer renewed successfully.",
    latencyMs,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}
