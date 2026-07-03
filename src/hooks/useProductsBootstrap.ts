import { useEffect, useState } from "react";
import { Product } from "../types";
import {
  DEFAULT_HEROES,
  HeroImages,
  fetchHeroImages,
  fetchProducts,
} from "../services/productService";

export function useProductsBootstrap() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [heroImages, setHeroImages] = useState<HeroImages>(DEFAULT_HEROES);

  useEffect(() => {
    async function initApp() {
      setIsLoadingProducts(true);

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
  };
}
