import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAuth, isAuthError } from "@/lib/session";
import { FS } from "@/lib/firestore-schema";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ["intern"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;
  if (!adminDb) return NextResponse.json({ error: "DB not available" }, { status: 500 });

  try {
    const profileRef = adminDb.collection(FS.INTERN_PROFILES).doc(session.id);
    const profileSnap = await profileRef.get();

    if (!profileSnap.exists) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileData = profileSnap.data();
    if (profileData?.certificate_status === 'approved' || profileData?.certificate_status === 'issued') {
      return NextResponse.json({ error: "Certificate already approved." }, { status: 400 });
    }
    if (profileData?.certificate_status === 'pending') {
      return NextResponse.json({ error: "Application already pending." }, { status: 400 });
    }

    // Check completed tasks count (must be at least 3 completed tasks)
    // Uses "task_progress" collection — same collection the tasks API writes to
    const submissionsSnap = await adminDb
      .collection("task_progress")
      .where("intern_id", "==", session.id)
      .where("status", "==", "completed")
      .get();

    const completedCount = submissionsSnap.size;
    if (completedCount < 3) {
      return NextResponse.json(
        { error: `You must complete at least 3 tasks before applying for a certificate. Current completed: ${completedCount}/3` },
        { status: 400 }
      );
    }

    // Update status to pending
    await profileRef.update({
      certificate_status: 'pending',
      updated_at: new Date().toISOString()
    });

    const userSnap = await adminDb.collection(FS.USERS).doc(session.id).get();
    const internName = userSnap.data()?.full_name || "An intern";

    // Create notifications for Mentor and Admins
    const now = new Date().toISOString();
    const notifications = [];

    // 1. Notify Mentor
    const assignmentSnap = await adminDb.collection(FS.MENTOR_ASSIGNMENTS)
      .where("intern_id", "==", session.id)
      .where("status", "==", "active")
      .get();
      
    if (!assignmentSnap.empty) {
      const mentorId = assignmentSnap.docs[0].data().mentor_id;
      notifications.push({
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        user_id: mentorId,
        type: "certificate_requested",
        title: "Certificate Request",
        message: `${internName} has applied for their certificate.`,
        reference_id: session.id,
        is_read: false,
        created_at: now
      });
    }

    // 2. Notify Admins
    const adminsSnap = await adminDb.collection(FS.USERS).where("role", "==", "admin").get();
    adminsSnap.forEach(adminDoc => {
      notifications.push({
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        user_id: adminDoc.id,
        type: "certificate_requested",
        title: "Certificate Request",
        message: `${internName} has applied for their certificate.`,
        reference_id: session.id,
        is_read: false,
        created_at: now
      });
    });

    // Batch insert notifications
    if (notifications.length > 0) {
      const batch = adminDb.batch();
      notifications.forEach(notif => {
        const notifRef = adminDb!.collection(FS.NOTIFICATIONS).doc(notif.id);
        batch.set(notifRef, notif);
      });
      await batch.commit();
    }

    return NextResponse.json({ success: true, message: "Certificate requested successfully." });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
