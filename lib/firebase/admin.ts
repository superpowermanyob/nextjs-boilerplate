import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App | undefined;

function parseServiceAccount(): Record<string, string> | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    console.warn("[firebase/admin] FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON");
    return null;
  }
}

export function getAdminApp(): App | null {
  if (adminApp) {
    return adminApp;
  }

  const existing = getApps()[0];
  if (existing) {
    adminApp = existing;
    return adminApp;
  }

  const serviceAccount = parseServiceAccount();
  if (!serviceAccount) {
    return null;
  }

  adminApp = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });

  return adminApp;
}

export function getAdminFirestore() {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}

export function getAdminDatabase() {
  const app = getAdminApp();
  return app ? getDatabase(app) : null;
}
