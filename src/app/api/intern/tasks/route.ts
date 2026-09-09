import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/session";
import { adminDb } from "@/lib/firebase-admin";
import { FS } from "@/lib/firestore-schema";
import { getTrackTasks } from "@/lib/curriculum";

async function isProfileComplete(userId: string): Promise<boolean> {
  if (!adminDb) return false;
  const [userSnap, internSnap] = await Promise.all([
    adminDb.collection(FS.USERS).doc(userId).get(),
    adminDb.collection(FS.INTERN_PROFILES).doc(userId).get(),
  ]);

  if (!userSnap.exists) return false;

  const user = userSnap.data();
  const intern = internSnap.exists ? internSnap.data() : {};

  if (!user) return false;

  const hasAvatar = !!(user.avatar_url || (user as any).image_url);

  const fields = [
    { done: !!user.full_name },
    { done: !!user.gender },
    { done: !!(user.age || user.date_of_birth) },
    { done: !!user.bio },
    { done: !!user.city },
    { done: Array.isArray(user.skills) && user.skills.length > 0 },
    { done: !!(user.social_links?.linkedin || user.social_links?.github || user.linkedin || user.github) },
    { done: !!user.phone },
    { done: hasAvatar },
    { done: !!(intern?.track_selected || intern?.trackSelected || intern?.track) },
    { done: !!intern?.university },
    { done: !!intern?.department },
    { done: !!intern?.semester },
  ];

  const doneCount = fields.filter(f => f.done).length;
  const pct = Math.round((doneCount / fields.length) * 100);

  // Requirements: At least 80% completed AND profile image is compulsory
  return hasAvatar && pct >= 80;
}

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, ["intern", "user"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;

  try {
    if (!adminDb) throw new Error("DB not initialized");

    // Check if profile is complete
    const complete = await isProfileComplete(session.id);
    if (!complete) {
      return NextResponse.json(
        {
          error: "Please complete your profile (at least 80% with profile picture) to access tasks.",
          profileIncomplete: true,
        },
        { status: 403 }
      );
    }

    // Fetch intern profile to get track_selected
    const internSnap = await adminDb
      .collection(FS.INTERN_PROFILES)
      .doc(session.id)
      .get();
    const internData = internSnap.data();
    const track = internData?.track_selected || internData?.trackSelected || internData?.track || "WEB_DEV";

    // Fetch all submissions by this intern
    const progressSnap = await adminDb
      .collection("task_progress")
      .where("intern_id", "==", session.id)
      .get();

    const submissions = progressSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Build a submissions map: task_id → submission doc
    const submissionsMap: Record<string, any> = {};
    for (const t of submissions) {
      submissionsMap[(t as any).task_id] = t;
    }

    // If there's a track, try to load tasks from DB, else fall back to curriculum
    let taskList: any[] = [];
    const dbTasksSnap = await adminDb
      .collection("track_tasks")
      .where("track_id", "==", track)
      .get();

    if (!dbTasksSnap.empty) {
      taskList = dbTasksSnap.docs
        .map((d) => ({ id: d.id, ...d.data(), source: "database" }))
        .sort((a: any, b: any) => (a.week_number ?? 0) - (b.week_number ?? 0));
    } else {
      // Fallback to static curriculum with normalized key
      const staticTasks = getTrackTasks(track);
      taskList = staticTasks.map((t, i) => ({
        id: t.id,
        track_id: track,
        title: t.title,
        scope: t.scope,
        criteria: t.criteria,
        week_number: i + 1,
        source: "default",
      }));
    }

    return NextResponse.json({ track, tasks: taskList, submissionsMap });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, ["intern", "user"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;

  try {
    if (!adminDb) throw new Error("DB not initialized");

    // Check if profile is complete
    const complete = await isProfileComplete(session.id);
    if (!complete) {
      return NextResponse.json(
        {
          error: "Please complete your profile to submit tasks.",
          profileIncomplete: true,
        },
        { status: 403 }
      );
    }

    const { taskId, submissionLink, title, notes } = await request.json();

    if (!taskId || !submissionLink) {
      return NextResponse.json(
        { error: "Task ID and Submission Link are required" },
        { status: 400 }
      );
    }

    const docId = `${session.id}_${taskId}`;
    const updateData: Record<string, any> = {
      intern_id: session.id,
      task_id: taskId,
      title: title || taskId,
      status: "reviewing",
      submission_link: submissionLink,
      updated_at: new Date().toISOString(),
    };
    if (typeof notes === 'string') {
      updateData.notes = notes.trim();
    }

    await adminDb
      .collection("task_progress")
      .doc(docId)
      .set(updateData, { merge: true });

    return NextResponse.json({
      success: true,
      message: "Work submitted successfully",
    });
  } catch (error: any) {
    console.error("Submit task error:", error);
    return NextResponse.json({ error: "Failed to submit work" }, { status: 500 });
  }
}
