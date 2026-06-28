const REQUIRED_FIREBASE_ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

const warnedKeys = new Set<string>();

function readEnv(key: (typeof REQUIRED_FIREBASE_ENV_KEYS)[number]): string {
  const value = process.env[key]?.trim();
  if (!value) {
    if (!warnedKeys.has(key)) {
      warnedKeys.add(key);
      console.warn(`[firebase/config] Missing environment variable: ${key}`);
    }
    return "";
  }
  return value;
}

export function getFirebaseConfig(): FirebaseClientConfig {
  for (const key of REQUIRED_FIREBASE_ENV_KEYS) {
    if (!process.env[key]?.trim() && !warnedKeys.has(key)) {
      warnedKeys.add(key);
      console.warn(`[firebase/config] Missing environment variable: ${key}`);
    }
  }

  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim();

  return {
    apiKey: readEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: readEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    databaseURL: readEnv("NEXT_PUBLIC_FIREBASE_DATABASE_URL"),
    projectId: readEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: readEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
    ...(measurementId ? { measurementId } : {}),
  };
}

export function isFirebaseConfigReady(): boolean {
  return REQUIRED_FIREBASE_ENV_KEYS.every((key) => Boolean(process.env[key]?.trim()));
}
