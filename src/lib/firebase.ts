import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { WebsiteData } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyAHqAeFGhd7ehaB999vXW-OlVjYZS1ohGs",
  authDomain: "boxwood-chalice-482510-i3.firebaseapp.com",
  projectId: "boxwood-chalice-482510-i3",
  storageBucket: "boxwood-chalice-482510-i3.firebasestorage.app",
  messagingSenderId: "579494487652",
  appId: "1:579494487652:web:d131c05f013cedb952a171",
  measurementId: "G-1XMS7Z5EDJ"
};

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
