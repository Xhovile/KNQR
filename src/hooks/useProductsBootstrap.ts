import { useEffect, useState } from "react";
import { Product } from "../types";
import {
  DEFAULT_HEROES,
  HeroImages,
  fetchHeroImages,
  fetchProducts,
} from "../services/productService";

const CATALOG_LOAD_NOTICE = "Catalog is taking longer than usual. Please wait a moment and refresh if needed.";
const HERO_CACHE_KEY = "knqr.hero-images.cache.v1";

function readHeroCache(): HeroImages {
  if (typeof window === "undefined") return DEFAULT_HEROES;

  try {
    const raw = window.localStorage.getItem(HERO_CACHE_KEY);
    if (!raw) return DEFAULT_HEROES;
    const parsed = JSON.parse(raw) as Partial<HeroImages>;
    return {
      home: parsed.home || "",
      apparel: parsed.apparel || "",
      bagsAccessories: parsed.bagsAccessories || "",
      fragrances: parsed.fragrances || "",
    };
  } catch {
    return DEFAULT_HEROES;
  }
}

export function useProductsBootstrap() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [heroImages, setHeroImages] = useState<HeroImages>(() => readHeroCache());
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
        if (cancelled) return;
        setHeroImages(heroes);
        try {
          window.localStorage.setItem(HERO_CACHE_KEY, JSON.stringify(heroes));
        } catch {
          // Ignore cache write failures.
        }
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
