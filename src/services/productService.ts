import { db } from "../lib/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";
import { Product } from "../types";
import { PRODUCTS } from "../data";

// Helper to remove any undefined properties recursively to prevent Firestore write crashes
function cleanUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, cleanUndefined(v)])
    );
  }
  return obj;
}

const PRODUCTS_COLLECTION = "products";

/**
 * Fetches all products from Firestore.
 * If the collection is empty, seeds the database with initial products.
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const productsCol = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsCol);
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("Firestore products collection is empty. Seeding initial products...");
      await seedInitialProducts();
      // Fetch again after seeding
      const seededSnapshot = await getDocs(q);
      return seededSnapshot.docs.map(doc => doc.data() as Product);
    }
    
    return querySnapshot.docs.map(doc => doc.data() as Product);
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    // Return hard-coded products as fallback
    return PRODUCTS;
  }
}

/**
 * Seeds initial products into Firestore.
 */
async function seedInitialProducts(): Promise<void> {
  try {
    for (const product of PRODUCTS) {
      const cleaned = cleanUndefined(product);
      await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), cleaned);
    }
    console.log("Initial products successfully seeded to Firestore.");
  } catch (error) {
    console.error("Failed to seed initial products:", error);
  }
}

/**
 * Creates a new product document in Firestore.
 */
export async function createProduct(product: Product): Promise<void> {
  const cleaned = cleanUndefined(product);
  await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), cleaned);
}

/**
 * Updates an existing product document in Firestore.
 */
export async function updateProduct(product: Product): Promise<void> {
  const cleaned = cleanUndefined(product);
  await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), cleaned);
}

/**
 * Deletes a product from Firestore.
 */
export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
}
