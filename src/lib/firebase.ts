import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore as getLiteFirestore, Firestore as LiteFirestore } from "firebase/firestore/lite";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Suppress known Firebase GRPC background connection errors in Next.js
// Only override once and only on the client side to avoid SSR/React mount issues
if (typeof window !== 'undefined') {
  const _orig = console.error;
  console.error = (...args: unknown[]) => {
    const msg = args.map((a: unknown) =>
      a && typeof a === 'object' && (a as { message?: string }).message
        ? (a as { message: string }).message
        : String(a)
    ).join(' ');
    if (
      msg.includes('GRPC error has no .code') ||
      msg.includes('GrpcConnection RPC') ||
      msg.includes('@firebase/firestore')
    ) {
      return;
    }
    _orig.apply(console, args);
  };
}


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let firestoreDb: LiteFirestore | undefined;
let realtimeDbObj: Firestore | undefined;
let authObj: Auth | undefined;

// Prevent duplicate initialization in Next.js hot-reload environments
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  firestoreDb = getLiteFirestore(app);
  realtimeDbObj = getFirestore(app);
  authObj = getAuth(app);
} catch (error: unknown) {
  console.warn("[Firebase] Client initialization warning:", (error as Error).message);
}

export const firestore = firestoreDb as LiteFirestore;
export const realtimeDb = realtimeDbObj as Firestore;
export const auth = authObj as Auth;
