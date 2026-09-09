import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
  query,
  where,
} from "firebase/firestore/lite";
import { firestore } from "./firebase";

// ─────────────────────────────────────────────
//  Types (client-side / legacy)
// ─────────────────────────────────────────────

export interface Intern {
  id: string;
  fullName: string;
  email: string;
  university: string;
  trackSelected: 'PYTHON' | 'UI_UX' | 'CPP' | 'WEB_DEV' | 'REACT' | 'NEXT_JS' | 'MERN';
  rollNumber: string;
  applicationTimestamp: string;
  status: 'APPLIED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submissionData: null | {
    submissionTimestamp: string;
    githubRepositoryUrl: string;
    liveDeploymentUrl?: string;
    figmaProjectUrl?: string;
    studentNotes: string;
    completedTaskCount: number;
    completedTasks: number[];
  };
}

export interface Certificate {
  certificateNumber: string;
  associatedRollNumber: string;
  recipientName: string;
  trackTitle: string;
  issuanceDate: string;
  isValid: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  contentMarkdown: string;
  excerpt: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  tags: string[];
  publishedAt: string;
  isFeatured: boolean;
}

export interface ClientMessage {
  id: string;
  clientName: string;
  clientEmail: string;
  organization: string;
  serviceType: string;
  budget: string;
  message: string;
  timestamp: string;
  status: 'UNREAD' | 'READ' | 'RESPONDED';
}

// ─────────────────────────────────────────────
//  New: Firestore-backed types (replacing Supabase)
// ─────────────────────────────────────────────

export interface FSUser {
  id: string;
  full_name: string;
  email: string | null;
  phone_number: string | null;
  role: 'intern' | 'mentor' | 'support' | 'admin' | 'staff';
  image_url: string | null;
  gender: string | null;
  assigned_tracks: string[];
  created_at: string;
}

export interface FSInternProfile {
  user_id: string;
  track_selected: string | null;
  roll_number: string | null;
  university: string | null;
  degree: string | null;
  city: string | null;
  cgpa: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  application_status: 'APPLIED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | null;
  start_date: string | null;
  enrolled_at: string | null;
  assigned_mentor_id: string | null;
  phone_number: string | null;
  email: string | null;
  created_at: string;
}

export interface FSTrackTask {
  id: string;
  track_id: string;
  mentor_id: string;
  title: string;
  scope: string;
  criteria: string;
  week_number: number;
  created_at: string;
}

export interface FSTaskProgress {
  intern_id: string;
  task_id: string;
  status: 'pending' | 'completed' | 'reviewing';
  submission_link: string | null;
  mentor_feedback: string | null;
  updated_at: string;
}

export interface FSComplaint {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved' | 'closed';
  created_at: string;
}

export interface FSHomepageTeam {
  id: string;
  user_id: string | null;
  name: string;
  designation: string;
  bio: string;
  badge: string;
  skills: string[];
  image_url: string;
  is_active: boolean;
  display_order: number | null;
  created_at: string;
}

// ─────────────────────────────────────────────
//  Collection names
// ─────────────────────────────────────────────

const COLLECTIONS = {
  INTERNS: "interns",
  CERTIFICATES: "certificates",
  POSTS: "posts",
  MESSAGES: "messages",
  COUNTERS: "counters",
} as const;

const COUNTER_DOC = "global";

// ─────────────────────────────────────────────
//  Seed initial blog posts (runs once)
// ─────────────────────────────────────────────

const INITIAL_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "Next.js 15 & Serverless Edge: Orchestrating Decoupled Architecture",
    slug: "nextjs-15-serverless-edge-decoupled-architecture",
    excerpt: "How to architecture high-throughput full-stack endpoints with sub-50ms Edge compute times and zero infrastructure costs.",
    contentMarkdown: `## Decoupling Serverless Functions from Rendering Engines

In traditional serverless applications, the user's client request waits synchronously for slow back-end operations to finish. This creates a double penalty:
1. **LCP & UX Degradation:** The client experiences high-latency white screens.
2. **Compute Cost Exhaustion:** The serverless function remains warm and active, eating into execution budgets.

### The SAMStack Philosophy: Decoupled Queueing

At **SAMStack Tech**, we resolve this by enforcing a zero-wait execution cycle. When an intern applies, we process the metadata and database entries synchronously in under **10ms**, and immediately dispatch an asynchronous trigger to Firebase in the background.

\`\`\`javascript
// Immediate edge return context
const rollNumber = await db.interns.create({ ...profile });

// Asynchronous Firestore log (Fire and Forget)
db.messages.create({ ...auditPayload }).catch(console.error);

return NextResponse.json({ rollNumber }, { status: 201 });
\`\`\`

By offloading PDF rendering and SMTP mailing to a decoupled cloud service, our Edge handlers remain lightning fast, achieving perfect LCP scores while maintaining $0 operational costs.`,
    author: {
      name: "Suleman Zaheer",
      role: "Founder & Lead Engineer",
      avatarUrl: "/images/image.png"
    },
    tags: ["NEXTJS", "DEVOPS", "SERVERLESS"],
    publishedAt: "2026-05-15T08:00:00.000Z",
    isFeatured: true
  },
  {
    id: "post-2",
    title: "The Anatomy of Obsidian Aesthetics: Designing Dark-Luxury UI Panels",
    slug: "anatomy-of-obsidian-aesthetics-dark-luxury-ui",
    excerpt: "A deep dive into professional contrast, glassmorphism filters, variable HSL spacing, and layout scaling rules.",
    contentMarkdown: `## Core Luxury Design Principles

Elite software studios require elite brand validation. The aesthetic standard of your portals directly correlates to the premium value your enterprise provides. We avoid generic, high-brightness primary colors, opting instead for deep obsidian base scales, fine light-border layouts, and dynamic neon cybernetic accents.

### Color Coordinate Reference Systems

To establish proper dark luxury, avoid absolute flat black (\`#000000\`). We utilize a deep, layered sapphire-obsidian slate palette:

*   **Primary Background:** \`#0b0f19\` (Deep Midnight Slate)
*   **Card Containers:** \`rgba(17, 24, 39, 0.65)\` (Glassmorphism overlay)
*   **Borders:** \`1px solid rgba(255, 255, 255, 0.08)\` (Faint white outline)
*   **Cyber Highlight:** \`#06b6d4\` (Neon Cyan glow)

### The Magic of Glassmorphism

Standard cards feel heavy. Glass containers feel alive because they allow background textures to bleed through. Accomplish this dynamically using pure CSS properties:

\`\`\`css
.luxury-card {
  background: rgba(17, 24, 39, 0.65);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.luxury-card:hover {
  border-color: rgba(6, 182, 212, 0.4);
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.15);
  transform: translateY(-2px);
}
\`\`\`

Applying smooth CSS transformations and subtle cyan-glowing shadows on hover elements provides candidates with micro-feedback mechanisms that feel premium, fluid, and robust.`,
    author: {
      name: "Suleman Zaheer",
      role: "Founder & Lead Engineer",
      avatarUrl: "/images/image.png"
    },
    tags: ["UI_UX", "CSS", "BRANDING"],
    publishedAt: "2026-05-16T12:00:00.000Z",
    isFeatured: false
  }
];

async function seedPostsIfNeeded() {
  const colRef = collection(firestore, COLLECTIONS.POSTS);
  const snap = await getDocs(colRef);
  if (!snap.empty) return;

  for (const post of INITIAL_POSTS) {
    await setDoc(doc(firestore, COLLECTIONS.POSTS, post.id), post);
  }
}

// ─────────────────────────────────────────────
//  Counter helper (atomic roll number sequence)
// ─────────────────────────────────────────────

async function getNextSequence(): Promise<number> {
  const counterRef = doc(firestore, COLLECTIONS.COUNTERS, COUNTER_DOC);
  const nextSeq = await runTransaction(firestore, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? (snap.data().lastAssignedSequence as number) : 0;
    const next = current + 1;
    tx.set(counterRef, { lastAssignedSequence: next }, { merge: true });
    return next;
  });
  return nextSeq;
}

// ─────────────────────────────────────────────
//  DB Access Methods — client-side (unchanged)
// ─────────────────────────────────────────────

export const db = {
  interns: {
    async list(): Promise<Intern[]> {
      const snap = await getDocs(collection(firestore, COLLECTIONS.INTERNS));
      return snap.docs.map(d => {
        const data = d.data();
        return { ...data, email: data.email || data.gmail || '' } as Intern;
      });
    },

    async get(id: string): Promise<Intern | null> {
      // Try by document ID first
      const byId = await getDoc(doc(firestore, COLLECTIONS.INTERNS, id));
      if (byId.exists()) {
        const data = byId.data();
        return { ...data, email: data.email || data.gmail || '' } as Intern;
      }

      // Fall back to querying by rollNumber
      const q = query(
        collection(firestore, COLLECTIONS.INTERNS),
        where("rollNumber", "==", id)
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      const data = snap.docs[0].data();
      return { ...data, email: data.email || data.gmail || '' } as Intern;
    },

    async getByEmailAndRoll(email: string, rollNumber: string): Promise<Intern | null> {
      const q = query(
        collection(firestore, COLLECTIONS.INTERNS),
        where("email", "==", email.toLowerCase()),
        where("rollNumber", "==", rollNumber)
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return snap.docs[0].data() as Intern;
    },

    async create(intern: Omit<Intern, 'id' | 'applicationTimestamp' | 'rollNumber' | 'status' | 'submissionData'>): Promise<Intern> {
      const sequence = await getNextSequence();
      const rollNumber = `SAM-2026-${String(sequence).padStart(4, '0')}`;
      const id = `intern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const newIntern: Intern = {
        ...intern,
        id,
        email: intern.email.toLowerCase(),
        rollNumber,
        applicationTimestamp: new Date().toISOString(),
        status: 'APPLIED',
        submissionData: null,
      };

      await setDoc(doc(firestore, COLLECTIONS.INTERNS, id), newIntern);
      return newIntern;
    },

    async updateStatus(id: string, status: 'APPLIED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'): Promise<boolean> {
      const intern = await db.interns.get(id);
      if (!intern) return false;
      await updateDoc(doc(firestore, COLLECTIONS.INTERNS, intern.id), { status });
      return true;
    },

    async submitWork(id: string, submission: Record<string, unknown>): Promise<boolean> {
      const intern = await db.interns.get(id);
      if (!intern) return false;
      await updateDoc(doc(firestore, COLLECTIONS.INTERNS, intern.id), {
        status: 'SUBMITTED',
        submissionData: submission,
      });
      return true;
    },

    async delete(id: string): Promise<boolean> {
      const intern = await db.interns.get(id);
      if (!intern) return false;
      await deleteDoc(doc(firestore, COLLECTIONS.INTERNS, intern.id));
      return true;
    },

    async purgeAll(): Promise<boolean> {
      const snap = await getDocs(collection(firestore, COLLECTIONS.INTERNS));
      const certSnap = await getDocs(collection(firestore, COLLECTIONS.CERTIFICATES));
      const counterRef = doc(firestore, COLLECTIONS.COUNTERS, COUNTER_DOC);

      await runTransaction(firestore, async (tx) => {
        snap.docs.forEach(d => tx.delete(d.ref));
        certSnap.docs.forEach(d => tx.delete(d.ref));
        tx.set(counterRef, { lastAssignedSequence: 0 });
      });
      return true;
    }
  },

  certificates: {
    async list(): Promise<Certificate[]> {
      const snap = await getDocs(collection(firestore, COLLECTIONS.CERTIFICATES));
      return snap.docs.map(d => d.data() as Certificate);
    },

    async get(certificateNumber: string): Promise<Certificate | null> {
      const q = query(
        collection(firestore, COLLECTIONS.CERTIFICATES),
        where("certificateNumber", "==", certificateNumber.toUpperCase())
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return snap.docs[0].data() as Certificate;
    },

    async create(certificate: Omit<Certificate, 'issuanceDate' | 'isValid'>): Promise<Certificate> {
      const q = query(
        collection(firestore, COLLECTIONS.CERTIFICATES),
        where("associatedRollNumber", "==", certificate.associatedRollNumber)
      );
      const existing = await getDocs(q);
      if (!existing.empty) return existing.docs[0].data() as Certificate;

      const newCert: Certificate = {
        ...certificate,
        certificateNumber: certificate.certificateNumber.toUpperCase(),
        issuanceDate: new Date().toISOString(),
        isValid: true,
      };

      await setDoc(
        doc(firestore, COLLECTIONS.CERTIFICATES, newCert.certificateNumber),
        newCert
      );
      return newCert;
    }
  },

  posts: {
    async list(): Promise<BlogPost[]> {
      try {
        await seedPostsIfNeeded();
        const snap = await getDocs(collection(firestore, COLLECTIONS.POSTS));
        return snap.docs.map(d => d.data() as BlogPost);
      } catch (_) {
        console.warn("Falling back to local INITIAL_POSTS due to Firebase error.");
        return INITIAL_POSTS;
      }
    },

    async getBySlug(slug: string): Promise<BlogPost | null> {
      try {
        await seedPostsIfNeeded();
        const q = query(
          collection(firestore, COLLECTIONS.POSTS),
          where("slug", "==", slug)
        );
        const snap = await getDocs(q);
        if (snap.empty) return null;
        return snap.docs[0].data() as BlogPost;
      } catch (_) {
        console.warn("Falling back to local INITIAL_POSTS for slug due to Firebase error.");
        return INITIAL_POSTS.find(p => p.slug === slug) || null;
      }
    }
  },

  messages: {
    async list(): Promise<ClientMessage[]> {
      const snap = await getDocs(collection(firestore, COLLECTIONS.MESSAGES));
      return snap.docs.map(d => d.data() as ClientMessage);
    },

    async create(message: Omit<ClientMessage, 'id' | 'timestamp' | 'status'>): Promise<ClientMessage> {
      const newMessage: ClientMessage = {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp: new Date().toISOString(),
        status: 'UNREAD',
      };
      await setDoc(doc(firestore, COLLECTIONS.MESSAGES, newMessage.id), newMessage);
      return newMessage;
    },

    async updateStatus(id: string, status: 'UNREAD' | 'READ' | 'RESPONDED'): Promise<boolean> {
      const ref = doc(firestore, COLLECTIONS.MESSAGES, id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return false;
      await updateDoc(ref, { status });
      return true;
    }
  }
};

// ─────────────────────────────────────────────
//  Server-side Admin Firestore helpers
//  (replaces ALL Supabase table operations)
//  Usage in API routes:
//    import { adminDb } from '@/lib/firebase-admin'
//    import { createAdminDb } from '@/lib/db'
//    const adb = createAdminDb(adminDb!)
// ─────────────────────────────────────────────

import type { Firestore, Query, QuerySnapshot } from 'firebase-admin/firestore';

export function createAdminDb(firestoreDb: Firestore) {
  return {

    // ── Users ──────────────────────────────────────────────────────
    users: {
      async get(uid: string): Promise<FSUser | null> {
        const snap = await firestoreDb.collection('users').doc(uid).get();
        if (!snap.exists) return null;
        return { id: snap.id, ...snap.data() } as FSUser;
      },

      async getByEmail(email: string): Promise<FSUser | null> {
        const snap = await firestoreDb.collection('users')
          .where('email', '==', email.toLowerCase()).limit(1).get();
        if (snap.empty) return null;
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as FSUser;
      },

      async getByPhone(phone: string): Promise<FSUser | null> {
        const snap = await firestoreDb.collection('users')
          .where('phone_number', '==', phone).limit(1).get();
        if (snap.empty) return null;
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as FSUser;
      },

      async list(role?: string): Promise<FSUser[]> {
        let q: Query = firestoreDb.collection('users').orderBy('created_at', 'desc');
        if (role && role !== 'ALL') {
          q = firestoreDb.collection('users')
            .where('role', '==', role).orderBy('created_at', 'desc');
        }
        const snap = await q.get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }) as FSUser);
      },

      async create(uid: string, data: Omit<FSUser, 'id' | 'created_at'>): Promise<FSUser> {
        const now = new Date().toISOString();
        const user: Omit<FSUser, 'id'> = {
          ...data,
          assigned_tracks: data.assigned_tracks || [],
          created_at: now,
        };
        await firestoreDb.collection('users').doc(uid).set(user);
        return { id: uid, ...user };
      },

      async update(uid: string, data: Partial<Omit<FSUser, 'id' | 'created_at'>>): Promise<void> {
        await firestoreDb.collection('users').doc(uid).update(data);
      },

      async delete(uid: string): Promise<void> {
        await firestoreDb.collection('users').doc(uid).delete();
      },
    },

    // ── Intern Profiles ────────────────────────────────────────────
    internProfiles: {
      async get(userId: string): Promise<FSInternProfile | null> {
        const snap = await firestoreDb.collection('intern_profiles').doc(userId).get();
        if (!snap.exists) return null;
        return snap.data() as FSInternProfile;
      },

      async list(): Promise<FSInternProfile[]> {
        const snap = await firestoreDb.collection('intern_profiles').get();
        return snap.docs.map(d => d.data() as FSInternProfile);
      },

      async listWithUsers(): Promise<(FSInternProfile & { user: FSUser | null })[]> {
        const [profilesSnap, usersSnap] = await Promise.all([
          firestoreDb.collection('intern_profiles').get(),
          firestoreDb.collection('users').where('role', '==', 'intern').get(),
        ]);
        const userMap = new Map<string, FSUser>();
        usersSnap.docs.forEach(d => userMap.set(d.id, { id: d.id, ...d.data() } as FSUser));
        return profilesSnap.docs.map(d => ({
          ...(d.data() as FSInternProfile),
          user: userMap.get((d.data() as FSInternProfile).user_id) || null,
        }));
      },

      async getByMentorTracks(
        tracks: string[],
        mentorGender?: string | null
      ): Promise<(FSInternProfile & { user: FSUser | null })[]> {
        if (tracks.length === 0) return [];
        const snap = await firestoreDb.collection('intern_profiles')
          .where('track_selected', 'in', tracks).get();
        const profiles = snap.docs.map(d => d.data() as FSInternProfile);

        const userIds = [...new Set(profiles.map(p => p.user_id))];
        const userDocs = await Promise.all(
          userIds.map(uid => firestoreDb.collection('users').doc(uid).get())
        );
        const userMap = new Map<string, FSUser>();
        userDocs.forEach(d => {
          if (d.exists) userMap.set(d.id, { id: d.id, ...d.data() } as FSUser);
        });

        const result = profiles.map(p => ({ ...p, user: userMap.get(p.user_id) || null }));
        if (mentorGender && mentorGender !== 'OTHER') {
          return result.filter(r => r.user?.gender === mentorGender);
        }
        return result;
      },

      async upsert(userId: string, data: Partial<FSInternProfile>): Promise<void> {
        const ref = firestoreDb.collection('intern_profiles').doc(userId);
        const snap = await ref.get();
        if (snap.exists) {
          await ref.update(data);
        } else {
          await ref.set({
            user_id: userId,
            created_at: new Date().toISOString(),
            ...data,
          });
        }
      },

      async delete(userId: string): Promise<void> {
        await firestoreDb.collection('intern_profiles').doc(userId).delete();
      },
    },

    // ── Track Tasks ────────────────────────────────────────────────
    trackTasks: {
      async list(trackIds?: string[]): Promise<FSTrackTask[]> {
        let snap: QuerySnapshot;
        if (trackIds && trackIds.length > 0) {
          snap = await firestoreDb.collection('track_tasks')
            .where('track_id', 'in', trackIds)
            .orderBy('week_number', 'asc').get();
        } else {
          snap = await firestoreDb.collection('track_tasks')
            .orderBy('week_number', 'asc').get();
        }
        return snap.docs.map(d => ({ id: d.id, ...d.data() }) as FSTrackTask);
      },

      async get(taskId: string): Promise<FSTrackTask | null> {
        const snap = await firestoreDb.collection('track_tasks').doc(taskId).get();
        if (!snap.exists) return null;
        return { id: snap.id, ...snap.data() } as FSTrackTask;
      },

      async create(data: Omit<FSTrackTask, 'id' | 'created_at'>): Promise<FSTrackTask> {
        const ref = firestoreDb.collection('track_tasks').doc();
        const task: FSTrackTask = {
          id: ref.id,
          ...data,
          created_at: new Date().toISOString(),
        };
        await ref.set(task);
        return task;
      },

      async update(taskId: string, data: Partial<Omit<FSTrackTask, 'id' | 'created_at'>>): Promise<void> {
        await firestoreDb.collection('track_tasks').doc(taskId).update(data);
      },

      async delete(taskId: string, mentorId?: string): Promise<void> {
        const ref = firestoreDb.collection('track_tasks').doc(taskId);
        const snap = await ref.get();
        if (!snap.exists) return;
        if (mentorId && snap.data()?.mentor_id !== mentorId) {
          throw new Error('Forbidden — you can only delete your own tasks');
        }
        await ref.delete();
      },
    },

    // ── Task Progress ──────────────────────────────────────────────
    taskProgress: {
      async upsert(
        internId: string,
        taskId: string,
        data: Partial<Omit<FSTaskProgress, 'intern_id' | 'task_id'>>
      ): Promise<void> {
        const docId = `${internId}_${taskId}`;
        await firestoreDb.collection('task_progress').doc(docId).set({
          intern_id: internId,
          task_id: taskId,
          ...data,
          updated_at: new Date().toISOString(),
        }, { merge: true });
      },

      async listForIntern(internId: string): Promise<FSTaskProgress[]> {
        const snap = await firestoreDb.collection('task_progress')
          .where('intern_id', '==', internId).get();
        return snap.docs.map(d => d.data() as FSTaskProgress);
      },

      async deleteForUser(internId: string): Promise<void> {
        const snap = await firestoreDb.collection('task_progress')
          .where('intern_id', '==', internId).get();
        const batch = firestoreDb.batch();
        snap.docs.forEach(d => batch.delete(d.ref));
        await batch.commit();
      },
    },

    // ── Complaints ─────────────────────────────────────────────────
    complaints: {
      async list(userId?: string): Promise<FSComplaint[]> {
        let snap: QuerySnapshot;
        if (userId) {
          snap = await firestoreDb.collection('complaints')
            .where('user_id', '==', userId)
            .orderBy('created_at', 'desc').get();
        } else {
          snap = await firestoreDb.collection('complaints')
            .orderBy('created_at', 'desc').get();
        }
        return snap.docs.map(d => ({ id: d.id, ...d.data() }) as FSComplaint);
      },

      async listWithUsers(): Promise<(FSComplaint & { user_full_name?: string })[]> {
        const snap = await firestoreDb.collection('complaints')
          .orderBy('created_at', 'desc').get();
        const complaints = snap.docs.map(d => ({ id: d.id, ...d.data() }) as FSComplaint);

        const userIds = [...new Set(complaints.map(c => c.user_id))];
        const userDocs = await Promise.all(
          userIds.map(uid => firestoreDb.collection('users').doc(uid).get())
        );
        const userMap = new Map<string, string>();
        userDocs.forEach(d => {
          if (d.exists) userMap.set(d.id, (d.data() as FSUser).full_name);
        });

        return complaints.map(c => ({ ...c, user_full_name: userMap.get(c.user_id) }));
      },

      async create(userId: string, subject: string, message: string): Promise<FSComplaint> {
        const ref = firestoreDb.collection('complaints').doc();
        const complaint: FSComplaint = {
          id: ref.id,
          user_id: userId,
          subject,
          message,
          status: 'open',
          created_at: new Date().toISOString(),
        };
        await ref.set(complaint);
        return complaint;
      },

      async updateStatus(complaintId: string, status: string): Promise<void> {
        await firestoreDb.collection('complaints').doc(complaintId)
          .update({ status: status.toLowerCase() });
      },

      async deleteForUser(userId: string): Promise<void> {
        const snap = await firestoreDb.collection('complaints')
          .where('user_id', '==', userId).get();
        const batch = firestoreDb.batch();
        snap.docs.forEach(d => batch.delete(d.ref));
        await batch.commit();
      },
    },

    // ── Homepage Team ──────────────────────────────────────────────
    homepageTeam: {
      async list(activeOnly = false): Promise<FSHomepageTeam[]> {
        const snap = await firestoreDb.collection('homepage_team')
          .orderBy('display_order', 'asc').get();
        let items = snap.docs.map(d => ({ id: d.id, ...d.data() }) as FSHomepageTeam);
        if (activeOnly) {
          items = items.filter(item => item.is_active === true);
        }
        return items;
      },

      async getByUserId(userId: string): Promise<FSHomepageTeam | null> {
        const snap = await firestoreDb.collection('homepage_team')
          .where('user_id', '==', userId).limit(1).get();
        if (snap.empty) return null;
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as FSHomepageTeam;
      },

      async upsertByUserId(
        userId: string,
        data: Partial<Omit<FSHomepageTeam, 'id' | 'created_at'>>
      ): Promise<FSHomepageTeam> {
        const existing = await this.getByUserId(userId);
        if (existing) {
          await firestoreDb.collection('homepage_team').doc(existing.id).update(data);
          return { ...existing, ...data } as FSHomepageTeam;
        } else {
          const allSnap = await firestoreDb.collection('homepage_team')
            .orderBy('display_order', 'desc').limit(1).get();
          const nextOrder = allSnap.empty
            ? 1
            : ((allSnap.docs[0].data().display_order || 0) + 1);
          const ref = firestoreDb.collection('homepage_team').doc();
          const member: FSHomepageTeam = {
            id: ref.id,
            user_id: userId,
            name: '',
            designation: '',
            bio: '',
            badge: '',
            skills: [],
            image_url: '',
            is_active: true,
            display_order: nextOrder,
            created_at: new Date().toISOString(),
            ...data,
          };
          await ref.set(member);
          return member;
        }
      },

      async updateOrder(orderedIds: string[]): Promise<void> {
        const batch = firestoreDb.batch();
        orderedIds.forEach((id, i) => {
          batch.update(firestoreDb.collection('homepage_team').doc(id), { display_order: i + 1 });
        });
        await batch.commit();
      },

      async delete(id: string): Promise<void> {
        await firestoreDb.collection('homepage_team').doc(id).delete();
      },
    },
  };
}
