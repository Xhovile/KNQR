import { db, auth } from "../lib/firebase";
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
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

export const STRICT_REMOTE_CATALOG = true;

const PRODUCTS_COLLECTION = "products";
const PRODUCTS_CACHE_KEY = "knqr_products_cache";
const HEROES_CACHE_KEY = "knqr_heroes";

function safeLocalStorageGet(key: string): string | null {
  try {
    return typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string): void {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Ignore storage failures.
  }
}

function readProductsCache(): Product[] | null {
  const raw = safeLocalStorageGet(PRODUCTS_CACHE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Product[]) : null;
  } catch {
    return null;
  }
}

function writeProductsCache(products: Product[]): void {
  safeLocalStorageSet(PRODUCTS_CACHE_KEY, JSON.stringify(products));
}

function readHeroesCache(): HeroImages | null {
  const raw = safeLocalStorageGet(HEROES_CACHE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_HEROES, ...(parsed || {}) } as HeroImages;
  } catch {
    return null;
  }
}

function writeHeroesCache(heroes: HeroImages): void {
  safeLocalStorageSet(HEROES_CACHE_KEY, JSON.stringify(heroes));
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

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 4000,
  errorMsg = "Database operation timed out. Firestore may be blocked by browser privacy tools, network restrictions, or an incorrect Firebase configuration."
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMsg)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
}

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

export async function fetchHeroImages(): Promise<HeroImages> {
  try {
    const docSnap = await withTimeout(getDoc(doc(db, "settings", "heroes")), 3000);
    if (docSnap.exists()) {
      const data = { ...DEFAULT_HEROES, ...(docSnap.data() as Partial<HeroImages>) } as HeroImages;
      writeHeroesCache(data);
      return data;
    }
  } catch (error: any) {
    console.warn("Hero image sync failed, using local cache:", error?.message || String(error));
  }

  return readHeroesCache() ?? DEFAULT_HEROES;
}

export async function updateHeroImageInDb(page: keyof HeroImages, url: string): Promise<void> {
  const current = readHeroesCache() ?? { ...DEFAULT_HEROES };
  current[page] = url;
  writeHeroesCache(current);

  try {
    await withTimeout(setDoc(doc(db, "settings", "heroes"), { [page]: url }, { merge: true }), 4000);
  } catch (error: any) {
    console.warn("Hero image update saved locally only:", error?.message || String(error));
  }
}

async function seedInitialProducts(): Promise<Product[]> {
  const cleaned = PRODUCTS.map((product) => cleanUndefined(product));
  writeProductsCache(cleaned);

  for (const product of cleaned) {
    try {
      await withTimeout(setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product), 5000);
    } catch (error: any) {
      console.warn(`Failed to seed product ${product.id}:`, error?.message || String(error));
    }
  }

  return cleaned;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const snapshot = await withTimeout(getDocs(collection(db, PRODUCTS_COLLECTION)), 8000);
    const products = snapshot.docs.map((d) => d.data() as Product);

    if (products.length === 0) {
      return seedInitialProducts();
    }

    writeProductsCache(products);
    return products;
  } catch (error: any) {
    console.warn("Product sync failed, using local cache/default data:", error?.message || String(error));
    const cached = readProductsCache();
    if (cached && cached.length > 0) return cached;

    writeProductsCache(PRODUCTS);
    return PRODUCTS;
  }
}

export async function createProduct(product: Product): Promise<void> {
  const cleaned = cleanUndefined(product);
  const cached = readProductsCache() ?? PRODUCTS;
  writeProductsCache([cleaned, ...cached.filter((item) => item.id !== cleaned.id)]);

  try {
    await withTimeout(setDoc(doc(db, PRODUCTS_COLLECTION, cleaned.id), cleaned), 8000);
  } catch (error: any) {
    console.warn("Create product saved locally only:", error?.message || String(error));
  }
}

export async function updateProduct(product: Product): Promise<void> {
  const cleaned = cleanUndefined(product);
  const cached = readProductsCache() ?? PRODUCTS;
  writeProductsCache(cached.map((item) => (item.id === cleaned.id ? cleaned : item)));

  try {
    await withTimeout(setDoc(doc(db, PRODUCTS_COLLECTION, cleaned.id), cleaned), 8000);
  } catch (error: any) {
    console.warn("Update product saved locally only:", error?.message || String(error));
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const cached = readProductsCache() ?? PRODUCTS;
  writeProductsCache(cached.filter((item) => item.id !== productId));

  try {
    await withTimeout(deleteDoc(doc(db, PRODUCTS_COLLECTION, productId)), 8000);
  } catch (error: any) {
    console.warn("Delete product saved locally only:", error?.message || String(error));
  }
}
