import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
  measurementId: firebaseConfig.measurementId,
});

// Initialize Auth
export const auth = getAuth(app);

// Configure Firestore cache settings for robust offline caching
const dbSettings = {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
};

const hasCustomDb = firebaseConfig.firestoreDatabaseId && 
                    firebaseConfig.firestoreDatabaseId !== "default" && 
                    firebaseConfig.firestoreDatabaseId !== "(default)";

// Initialize Firestore with persistent cache
export const db = hasCustomDb
  ? initializeFirestore(app, dbSettings, firebaseConfig.firestoreDatabaseId)
  : initializeFirestore(app, dbSettings);

// Initialize Analytics conditionally
export let analytics: Analytics | null = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized.");
  }
}).catch((err) => {
  console.warn("Analytics not supported or blocked in this environment:", err);
});

