import { useEffect, useState } from "react";
import { Product } from "../types";
import {
  DEFAULT_HEROES,
  HeroImages,
  fetchHeroImages,
  fetchProducts,
} from "../services/productService";

const CATALOG_LOAD_NOTICE = "Catalog is taking longer than usual. Please wait a moment and refresh if needed.";

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
          console.error("Firestore products load failed:", productsResult.reason);
          setProductsList([]);
          setProductsError(CATALOG_LOAD_NOTICE);
        }

        if (heroesResult.status === "fulfilled") {
          setHeroImages(heroesResult.value);
        } else {
          console.error("Firestore hero images load failed:", heroesResult.reason);
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
