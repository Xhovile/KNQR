import React, { useState, useMemo } from "react";
import { Product } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface CollectionProps {
  products: Product[];
  onSelectCollection: (collectionCategory: string) => void;
  onAddToCart: (product: Product) => void;
  priceCurrency: "USD" | "MWK";
}

interface CollectionCardProps {
  product: Product;
  allProducts: Product[];
  onSelectCollection: (collectionCategory: string) => void;
}

function CollectionCard({ product, allProducts, onSelectCollection }: CollectionCardProps) {
  // Build a stable image set for this collection, starting with the hero image.
  const collectionImages = useMemo(() => {
    const categoryProducts = allProducts.filter(
      (p) => p.collectionCategory === product.collectionCategory && p.status === "active"
    );

    const orderedImages: string[] = [];
    const seen = new Set<string>();

    const addImage = (img?: string) => {
      if (!img || seen.has(img)) return;
      seen.add(img);
      orderedImages.push(img);
    };

    // Hero image first.
    addImage(product.image);

    // Then all other images from products in the same collection.
    categoryProducts.forEach((p) => {
      addImage(p.image);
      p.images?.forEach((img) => addImage(img));
    });

    // Fallback to any images on the product itself.
    product.images?.forEach((img) => addImage(img));

    return orderedImages;
  }, [allProducts, product.collectionCategory, product.image, product.images]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (collectionImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + collectionImages.length) % collectionImages.length);
  };

  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (collectionImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % collectionImages.length);
  };

  const activeImage = collectionImages[currentImageIndex] || product.image;

  return (
    <motion.div
      className="group flex flex-col items-center bg-transparent w-full"
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }}
      id={`collection-card-${product.id}`}
    >
      <div
        className="relative w-full aspect-[3/4] mb-5 rounded-2xl overflow-hidden border border-chocolate/15 cursor-pointer bg-[#ece5d8]"
        onClick={() => onSelectCollection(product.collectionCategory)}
        id={`card-image-click-${product.id}`}
      >
        {/* Static hero image with manual navigation. */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={activeImage}
              src={activeImage}
              alt={`${product.name} - collection image`}
              className="absolute inset-0 w-full h-full object-cover object-center"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              referrerPolicy="no-referrer"
              id={`card-img-${product.id}-${currentImageIndex}`}
            />
          </AnimatePresence>
        </div>

        {collectionImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPreviousImage}
              aria-label="Previous collection image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-chocolate/45 text-cream backdrop-blur-sm transition-transform duration-200 hover:scale-105 hover:bg-chocolate/70"
            >
              <span className="text-lg leading-none">‹</span>
            </button>

            <button
              type="button"
              onClick={goToNextImage}
              aria-label="Next collection image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-chocolate/45 text-cream backdrop-blur-sm transition-transform duration-200 hover:scale-105 hover:bg-chocolate/70"
            >
              <span className="text-lg leading-none">›</span>
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center text-[10px] font-bold tracking-[0.25em] uppercase text-cream/90 z-10 bg-chocolate/40 backdrop-blur-sm px-3 py-2 rounded-xl border border-cream/5">
          <span>
            {allProducts
              .filter((p) => p.collectionCategory === product.collectionCategory && p.status === "active")
              .reduce((sum, p) => sum + (p.stock || 0), 0)}{" "}
            In Stock
          </span>
        </div>

        <div className="absolute inset-0 bg-chocolate/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectCollection(product.collectionCategory);
            }}
            className="px-6 py-3 bg-chocolate hover:bg-gold text-cream hover:text-chocolate rounded-xl text-xs font-mono tracking-widest uppercase transition-all duration-200 transform scale-90 group-hover:scale-100 cursor-pointer shadow-lg font-bold"
            id={`quick-view-btn-${product.id}`}
          >
            Explore Collection
          </button>
        </div>
      </div>

      <div className="text-center w-full px-2" id={`card-info-${product.id}`}>
        <h4
          className="font-serif text-2xl font-normal text-chocolate hover:text-gold transition-colors cursor-pointer tracking-wide uppercase"
          onClick={() => onSelectCollection(product.collectionCategory)}
          id={`card-title-${product.id}`}
        >
          {product.collectionCategory || product.name}
        </h4>
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-chocolate/50 mt-1 select-none">
          View {product.collectionCategory || product.name} Catalog
        </p>
      </div>
    </motion.div>
  );
}

export default function Collection({
  products,
  onSelectCollection,
  priceCurrency,
}: CollectionProps) {
  // Extract unique category cards
  const categoryCards = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((p) => p.collectionCategory)));
    const CATEGORY_ORDER = ["apparel", "bags & accessories", "fragrances"];
    uniqueCategories.sort((a, b) => {
      const indexA = CATEGORY_ORDER.indexOf((a || "").toLowerCase());
      const indexB = CATEGORY_ORDER.indexOf((b || "").toLowerCase());

      const posA = indexA === -1 ? 999 : indexA;
      const posB = indexB === -1 ? 999 : indexB;

      return posA - posB;
    });
    return uniqueCategories
      .map((cat) => products.find((p) => p.collectionCategory === cat)!)
      .filter(Boolean);
  }, [products]);

  return (
    <section
      className="py-16 px-6 bg-white border-b-4 border-chocolate text-center"
      id="knqr-collection-section"
    >
      <div className="mb-12 max-w-sm mx-auto">
        <h3
          className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-chocolate mb-3 uppercase"
          id="collection-heading"
        >
          Our Collection
        </h3>
        <div className="w-12 h-[1px] bg-chocolate/30 mx-auto" />
      </div>

      <div className="flex flex-col gap-12 max-w-md mx-auto" id="collection-cards-list">
        {categoryCards.map((product, idx) => (
          <React.Fragment key={product.id}>
            <CollectionCard
              product={product}
              allProducts={products}
              onSelectCollection={onSelectCollection}
            />
            {idx < categoryCards.length - 1 && (
              <div
                className="border-b-4 border-chocolate w-full my-4"
                id={`collection-separator-${idx}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
