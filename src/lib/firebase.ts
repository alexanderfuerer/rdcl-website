import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { WebsiteData } from "../types";

// Firebase configuration from environment variables
// Falls back to empty strings if not configured (will fail gracefully)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Warn in development if Firebase is not configured
if (import.meta.env.DEV && !firebaseConfig.apiKey) {
  console.warn(
    "Firebase not configured. Copy .env.example to .env and fill in your Firebase credentials."
  );
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export interface Subscriber {
  email: string;
  date: string;
}

export const DataService = {
  async save(translations: Record<string, WebsiteData>): Promise<void> {
    try {
      const docRef = doc(db, "rdcl", "translations");
      await setDoc(docRef, translations);
    } catch (e) {
      console.error("Firestore Save Error:", e);
      throw new Error("Failed to save to database. Check your internet or permissions.");
    }
  },
  async load(): Promise<Record<string, WebsiteData> | null> {
    try {
      const docRef = doc(db, "rdcl", "translations");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        //@ts-ignore
        return docSnap.data() as Record<string, WebsiteData>;
      }
      return null;
    } catch (e) {
      console.error("Failed to load data from Firestore", e);
      return null;
    }
  },
  async saveSubscribers(subscribers: Subscriber[]): Promise<void> {
    try {
      const docRef = doc(db, "rdcl", "subscribers_list");
      await setDoc(docRef, { subscribers });
    } catch (e) {
      console.error("Firestore Save Subscribers Error:", e);
    }
  },
  async loadSubscribers(): Promise<Subscriber[]> {
    try {
      const docRef = doc(db, "rdcl", "subscribers_list");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().subscribers || [];
      }
      return [];
    } catch (e) {
      console.error("Failed to load subscribers from Firestore", e);
      return [];
    }
  }
};
