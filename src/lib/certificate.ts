import { FS } from "./firestore-schema";
import crypto from "crypto";
import type { Firestore } from "firebase-admin/firestore";

/**
 * Generates a globally unique certificate ID.
 * Format: SAM-CERT-YYYY-XXXXXX
 */
export async function generateUniqueCertificateId(adminDb: Firestore): Promise<string> {
  const year = new Date().getFullYear();
  let unique = false;
  let certId = "";
  
  while (!unique) {
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    certId = `SAM-CERT-${year}-${randomHex}`;
    
    // Check if this ID already exists in intern profiles
    const snap = await adminDb.collection(FS.INTERN_PROFILES)
      .where("certificate_id", "==", certId)
      .limit(1)
      .get();
      
    if (snap.empty) {
      unique = true;
    }
  }
  
  return certId;
}
