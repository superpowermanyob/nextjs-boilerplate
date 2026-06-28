import "server-only";

import { cert, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App | undefined;

type ServiceAccountJson = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
  [key: string]: unknown;
};

function normalizePrivateKey(serviceAccount: ServiceAccountJson): ServiceAccountJson {
  if (typeof serviceAccount.private_key !== "string") {
    return serviceAccount;
  }

  return {
    ...serviceAccount,
    private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
  };
}

function parseServiceAccountJson(raw: string): ServiceAccountJson {
  const trimmed = raw.trim();

  try {
    return normalizePrivateKey(JSON.parse(trimmed) as ServiceAccountJson);
  } catch {
    // Vercel 등에서 private_key의 \n 이 \\n 으로 이중 이스케이프된 경우
    const unescaped = trimmed.replace(/\\n/g, "\n");
    return normalizePrivateKey(JSON.parse(unescaped) as ServiceAccountJson);
  }
}

function parseServiceAccount(): ServiceAccountJson | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) {
    return null;
  }

  try {
    return parseServiceAccountJson(raw);
  } catch (error) {
    console.warn(
      "[firebase/admin] FIREBASE_SERVICE_ACCOUNT_JSON parse failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

export function getAdminApp(): App | null {
  if (adminApp) {
    return adminApp;
  }

  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return adminApp;
  }

  const serviceAccount = parseServiceAccount();
  if (!serviceAccount) {
    return null;
  }

  adminApp = initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? serviceAccount.project_id,
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
