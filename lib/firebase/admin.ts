import "server-only";

import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App | undefined;
let initError: string | null = null;

export type ServiceAccountJson = {
  type?: string;
  project_id?: string;
  client_email?: string;
  private_key?: string;
  [key: string]: unknown;
};

export type FirebaseAdminStatus = {
  configured: boolean;
  source: "json" | "split-env" | "none";
  parseOk: boolean;
  initialized: boolean;
  message: string;
};

function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function normalizePrivateKey(serviceAccount: ServiceAccountJson): ServiceAccountJson {
  if (typeof serviceAccount.private_key !== "string") {
    return serviceAccount;
  }

  return {
    ...serviceAccount,
    private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
  };
}

function tryParseJson(raw: string): ServiceAccountJson | null {
  const attempts = [
    raw,
    stripWrappingQuotes(raw),
    raw.replace(/\\n/g, "\n"),
    stripWrappingQuotes(raw).replace(/\\n/g, "\n"),
  ];

  for (const candidate of attempts) {
    try {
      const parsed = JSON.parse(candidate.trim()) as ServiceAccountJson;
      if (parsed && typeof parsed === "object") {
        return normalizePrivateKey(parsed);
      }
    } catch {
      // try next strategy
    }
  }

  return null;
}

function parseFromSplitEnv(): ServiceAccountJson | null {
  const clientEmail =
    process.env.FIREBASE_CLIENT_EMAIL?.trim() ??
    process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL?.trim();
  const privateKey =
    process.env.FIREBASE_PRIVATE_KEY?.trim() ??
    process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim();
  const projectId =
    process.env.FIREBASE_PROJECT_ID?.trim() ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();

  if (!clientEmail || !privateKey) {
    return null;
  }

  return normalizePrivateKey({
    type: "service_account",
    project_id: projectId,
    client_email: clientEmail,
    private_key: privateKey,
  });
}

function parseFromJsonEnv(): ServiceAccountJson | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) {
    return null;
  }

  const decoded = tryParseJson(raw);
  if (decoded) {
    return decoded;
  }

  // Base64로 저장한 경우
  try {
    const base64Decoded = Buffer.from(raw, "base64").toString("utf8");
    return tryParseJson(base64Decoded);
  } catch {
    return null;
  }
}

function parseServiceAccount(): {
  account: ServiceAccountJson | null;
  source: FirebaseAdminStatus["source"];
  parseOk: boolean;
} {
  const fromSplit = parseFromSplitEnv();
  if (fromSplit?.client_email && fromSplit.private_key) {
    return { account: fromSplit, source: "split-env", parseOk: true };
  }

  const fromJson = parseFromJsonEnv();
  if (fromJson?.client_email && fromJson.private_key) {
    return { account: fromJson, source: "json", parseOk: true };
  }

  const hasJsonEnv = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim());
  const hasSplitEnv = Boolean(
    process.env.FIREBASE_CLIENT_EMAIL?.trim() &&
      process.env.FIREBASE_PRIVATE_KEY?.trim(),
  );

  if (hasJsonEnv) {
    return { account: null, source: "json", parseOk: false };
  }

  if (hasSplitEnv) {
    return { account: null, source: "split-env", parseOk: false };
  }

  return { account: null, source: "none", parseOk: false };
}

export function getFirebaseAdminStatus(): FirebaseAdminStatus {
  const { account, source, parseOk } = parseServiceAccount();
  const initialized = Boolean(adminApp ?? getApps()[0]);

  if (initialized) {
    return {
      configured: true,
      source,
      parseOk: true,
      initialized: true,
      message: "Firebase Admin initialized.",
    };
  }

  if (initError) {
    return {
      configured: false,
      source,
      parseOk,
      initialized: false,
      message: initError,
    };
  }

  if (source === "none") {
    const hasEmail = Boolean(
      process.env.FIREBASE_CLIENT_EMAIL?.trim() ??
        process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL?.trim(),
    );
    const hasPrivateKey = Boolean(
      process.env.FIREBASE_PRIVATE_KEY?.trim() ??
        process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim(),
    );
    const hasJson = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim());

    let message =
      "Firebase Admin env missing. Vercel에 아래 중 하나를 Production에 등록 후 Redeploy 하세요.";

    if (hasPrivateKey && !hasEmail) {
      message =
        "FIREBASE_PRIVATE_KEY는 있는데 FIREBASE_CLIENT_EMAIL이 없습니다. client_email도 함께 등록하세요.";
    } else if (hasEmail && !hasPrivateKey) {
      message =
        "FIREBASE_CLIENT_EMAIL은 있는데 FIREBASE_PRIVATE_KEY가 없습니다. private_key도 함께 등록하세요.";
    } else if (hasJson) {
      message =
        "FIREBASE_SERVICE_ACCOUNT_JSON은 있지만 파싱/필드가 잘못됐습니다. JSON 전체를 한 줄로 넣거나 split 방식을 쓰세요.";
    }

    return {
      configured: false,
      source,
      parseOk: false,
      initialized: false,
      message,
    };
  }

  if (!parseOk) {
    return {
      configured: false,
      source,
      parseOk: false,
      initialized: false,
      message:
        "FIREBASE_SERVICE_ACCOUNT_JSON parse failed. Paste minified one-line JSON, or use FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY instead.",
    };
  }

  if (!account) {
    return {
      configured: false,
      source,
      parseOk: false,
      initialized: false,
      message: "Service account JSON is missing client_email or private_key.",
    };
  }

  return {
    configured: false,
    source,
    parseOk: true,
    initialized: false,
    message: "Firebase Admin is not initialized yet.",
  };
}

export function getAdminApp(): App | null {
  if (adminApp) {
    return adminApp;
  }

  if (getApps().length > 0) {
    adminApp = getApps()[0];
    initError = null;
    return adminApp;
  }

  const { account } = parseServiceAccount();
  if (!account?.client_email || !account.private_key) {
    return null;
  }

  try {
    adminApp = initializeApp({
      credential: cert(account as ServiceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId:
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? account.project_id,
    });
    initError = null;
    return adminApp;
  } catch (error) {
    initError =
      error instanceof Error
        ? `Firebase Admin initializeApp failed: ${error.message}`
        : "Firebase Admin initializeApp failed.";
    console.warn("[firebase/admin]", initError);
    return null;
  }
}

export function getAdminFirestore() {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}

export function getAdminDatabase() {
  const app = getAdminApp();
  return app ? getDatabase(app) : null;
}
