import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import { getFirestore, type Firestore } from "firebase/firestore";

import { getFirebaseConfig } from "@/lib/firebase/config";

let firebaseApp: FirebaseApp | undefined;
let firestore: Firestore | undefined;
let realtimeDatabase: Database | undefined;

function getFirebaseApp(): FirebaseApp {
  if (firebaseApp) {
    return firebaseApp;
  }

  firebaseApp = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
  return firebaseApp;
}

export function getClientFirestore(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp());
  }
  return firestore;
}

export function getClientDatabase(): Database {
  if (!realtimeDatabase) {
    realtimeDatabase = getDatabase(getFirebaseApp());
  }
  return realtimeDatabase;
}

export { getFirebaseApp };
