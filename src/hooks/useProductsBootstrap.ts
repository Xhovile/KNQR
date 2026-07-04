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
    let cancelled = false;

    async function loadProducts() {
      setIsLoadingProducts(true);
      setProductsError(null);

      try {
        const products = await fetchProducts();
        if (cancelled) return;
        setProductsList(products);
      } catch (error) {
        if (cancelled) return;
        console.error("Firestore products load failed:", error);
        setProductsList([]);
        setProductsError(CATALOG_LOAD_NOTICE);
      } finally {
        if (!cancelled) setIsLoadingProducts(false);
      }
    }

    async function loadHeroesInBackground() {
      try {
        const heroes = await fetchHeroImages();
        if (!cancelled) setHeroImages(heroes);
      } catch (error) {
        if (!cancelled) {
          console.error("Firestore hero images load failed:", error);
        }
      }
    }

    loadProducts();
    loadHeroesInBackground();

    return () => {
      cancelled = true;
    };
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
