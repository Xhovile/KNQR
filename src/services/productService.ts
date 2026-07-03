import { db, auth } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { Product } from "../types";
import { PRODUCTS } from "../data";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export interface HeroImages {
  home: string;
  apparel: string;
  bagsAccessories: string;
  fragrances: string;
}

export const DEFAULT_HEROES: HeroImages = {
  home: "",
  apparel: "",
  bagsAccessories: "",
  fragrances: "",
};

const PRODUCTS_COLLECTION = "products";

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const info: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
  };

  const serialized = JSON.stringify(info);
  console.error("Firestore Error:", serialized);
  throw new Error(serialized);
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 4000,
  errorMsg = "Database operation timed out. This is usually caused by an ad-blocker, Brave Shields, or firewall blocking the connection to Google Firestore. Please try disabling your browser shields / ad-blockers or check your connection, then try again."
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMsg)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
}

export async function fetchHeroImages(): Promise<HeroImages> {
  const path = "settings/heroes";
  try {
    const docRef = doc(db, "settings", "heroes");
    const docSnap = await withTimeout(getDoc(docRef), 3000);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { ...DEFAULT_HEROES, ...data } as HeroImages;
    }
    return DEFAULT_HEROES;
  } catch (error: any) {
    console.warn("Error fetching hero images from Firestore:", error?.message || String(error));
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function updateHeroImageInDb(page: keyof HeroImages, url: string): Promise<void> {
  const path = "settings/heroes";
  try {
    const docRef = doc(db, "settings", "heroes");
    await withTimeout(setDoc(docRef, { [page]: url }, { merge: true }), 4000);
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

function cleanUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(cleanUndefined) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, cleanUndefined(v)])
    ) as T;
  }
  return value;
}

async function seedInitialProducts(): Promise<void> {
  for (const product of PRODUCTS) {
    const cleaned = cleanUndefined(product);
    await withTimeout(setDoc(doc(db, PRODUCTS_COLLECTION, product.id), cleaned), 5000);
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const path = PRODUCTS_COLLECTION;
  try {
    const productsCol = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await withTimeout(getDocs(productsCol), 8000);

    let products = snapshot.docs.map((d) => d.data() as Product);

    if (products.length === 0) {
      await seedInitialProducts();
      const seededSnapshot = await withTimeout(getDocs(productsCol), 8000);
      products = seededSnapshot.docs.map((d) => d.data() as Product);
    }

    return products;
  } catch (error: any) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createProduct(product: Product): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${product.id}`;
  const cleaned = cleanUndefined(product);

  try {
    await withTimeout(setDoc(doc(db, PRODUCTS_COLLECTION, product.id), cleaned), 8000);
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateProduct(product: Product): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${product.id}`;
  const cleaned = cleanUndefined(product);

  try {
    await withTimeout(setDoc(doc(db, PRODUCTS_COLLECTION, product.id), cleaned), 8000);
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;

  try {
    await withTimeout(deleteDoc(doc(db, PRODUCTS_COLLECTION, productId)), 8000);
  } catch (error: any) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
