import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Only initialize once (safe for Next.js hot-reload)
if (!getApps().length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace escaped newlines for private key stored in .env
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
    // NOTE: No ADC fallback — if env vars are missing, adminDb/adminAuth will be null
    // and API routes that need them will gracefully return errors.
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export const adminAuth = getApps().length ? getAuth() : null;
export const adminDb = getApps().length ? getFirestore() : null;
export const adminStorage = getApps().length ? getStorage() : null;
