import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getFirestore as getRealtimeFirestore } from "firebase/firestore";

// Suppress known Firebase GRPC background connection errors in Next.js
// Only override once and only on the client side to avoid SSR/React mount issues
if (typeof window !== 'undefined') {
  const _orig = console.error;
  console.error = (...args: any[]) => {
    const msg = args.map((a: any) =>
      a && typeof a === 'object' && a.message ? a.message : String(a)
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

import { getAuth } from "firebase/auth";

let app;
let firestoreDb: any;
let realtimeDbObj: any;
let authObj: any;

// Prevent duplicate initialization in Next.js hot-reload environments
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  firestoreDb = getFirestore(app);
  realtimeDbObj = getRealtimeFirestore(app);
  authObj = getAuth(app);
} else {
  app = getApps()[0];
  firestoreDb = getFirestore(app);
  realtimeDbObj = getRealtimeFirestore(app);
  authObj = getAuth(app);
}

export const firestore = firestoreDb;
export const realtimeDb = realtimeDbObj;
export const auth = authObj;
