import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, memoryLocalCache } from "firebase/firestore";
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

const hasCustomDb = !!(firebaseConfig.firestoreDatabaseId && 
                      firebaseConfig.firestoreDatabaseId !== "default" && 
                      firebaseConfig.firestoreDatabaseId !== "(default)");

// Configure Firestore cache settings for robust offline caching
let db;
const isIframe = typeof window !== "undefined" && window.self !== window.top;

try {
  const dbSettings = {
    localCache: isIframe 
      ? memoryLocalCache()
      : persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
  };
  db = hasCustomDb
    ? initializeFirestore(app, dbSettings, firebaseConfig.firestoreDatabaseId)
    : initializeFirestore(app, dbSettings);
} catch (err) {
  console.warn("Failed to initialize Firestore with persistent local cache (IndexedDB might be blocked/disabled in iframe or browser):", err);
  try {
    const fallbackSettings = {
      localCache: memoryLocalCache(),
    };
    db = hasCustomDb
      ? initializeFirestore(app, fallbackSettings, firebaseConfig.firestoreDatabaseId)
      : initializeFirestore(app, fallbackSettings);
  } catch (fallbackErr) {
    console.error("Critical: Failed to initialize Firestore even with memory cache fallback:", fallbackErr);
    // Ultimate last-resort fallback: default initializeFirestore with no extra settings.
    db = hasCustomDb 
      ? initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId)
      : initializeFirestore(app, {});
  }
}

export { db };

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
