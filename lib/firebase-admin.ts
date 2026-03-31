import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

/**
 * Initialise Firebase Admin SDK once per server process.
 *
 * Required environment variables:
 *   FIREBASE_PROJECT_ID      — GCP project id
 *   FIREBASE_CLIENT_EMAIL    — service account client_email
 *   FIREBASE_PRIVATE_KEY     — service account private_key (newlines as \n)
 */
function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) {
    return existing[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin environment variables. " +
        "Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

let _db: Firestore | null = null;

/** Returns the shared Firestore instance, initialising Admin SDK on first call. */
export function getDb(): Firestore {
  if (!_db) {
    const app = getAdminApp();
    _db = getFirestore(app);
  }
  return _db;
}
