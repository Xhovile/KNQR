import { useEffect, useState } from "react";
import { Product } from "../types";
import {
  DEFAULT_HEROES,
  HeroImages,
  fetchHeroImages,
  fetchProducts,
} from "../services/productService";

function formatBootstrapError(reason: unknown): string {
  if (reason instanceof Error) return reason.message;
  if (typeof reason === "string") return reason;
  try {
    return JSON.stringify(reason, null, 2);
  } catch {
    return String(reason);
  }
}

export function useProductsBootstrap() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [heroImages, setHeroImages] = useState<HeroImages>(DEFAULT_HEROES);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    async function initApp() {
      setIsLoadingProducts(true);
      setProductsError(null);

      try {
        const [productsResult, heroesResult] = await Promise.allSettled([
          fetchProducts(),
          fetchHeroImages(),
        ]);

        if (productsResult.status === "fulfilled") {
          setProductsList(productsResult.value);
        } else {
          const message = formatBootstrapError(productsResult.reason);
          console.error("Firestore products load failed:", message);
          setProductsList([]);
          setProductsError(message);
        }

        if (heroesResult.status === "fulfilled") {
          setHeroImages(heroesResult.value);
        } else {
          console.error("Firestore hero images load failed:", formatBootstrapError(heroesResult.reason));
        }
      } finally {
        setIsLoadingProducts(false);
      }
    }

    initApp();
  }, []);

  return {
    productsList,
    setProductsList,
    isLoadingProducts,
    heroImages,
    setHeroImages,
    productsError,
  };
}
