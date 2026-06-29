import React, { useState, useEffect, useMemo } from "react";
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
  // Extract all unique images of products in this collection category
  const allImages = useMemo(() => {
    const imagesSet = new Set<string>();
    
    // Find all products in this category
    const categoryProducts = allProducts.filter(
      (p) => p.collectionCategory === product.collectionCategory && p.status === "active"
    );

    // Collect images
    categoryProducts.forEach((p) => {
      if (p.image) imagesSet.add(p.image);
      if (p.images && p.images.length > 0) {
        p.images.forEach((img) => {
          if (img) imagesSet.add(img);
        });
      }
    });

    // Fallback if none found
    if (imagesSet.size === 0) {
      if (product.image) imagesSet.add(product.image);
      if (product.images) {
        product.images.forEach((img) => {
          if (img) imagesSet.add(img);
        });
      }
    }

    return Array.from(imagesSet);
  }, [allProducts, product.collectionCategory, product.image, product.images]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (allImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [allImages]);

  const activeImage = allImages[currentImageIndex] || product.image;

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
        {/* Parallax crossfade transitions for images */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={activeImage}
              src={activeImage}
              alt={`${product.name} - slide`}
              className="absolute inset-0 w-full h-full object-cover object-center"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1.01 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              referrerPolicy="no-referrer"
              id={`card-img-${product.id}-${currentImageIndex}`}
            />
          </AnimatePresence>
        </div>

        {/* Custom luxury indicator dots at the top center representing active index */}
        {allImages.length > 1 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-20 bg-chocolate/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
            {allImages.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentImageIndex ? "bg-gold scale-125" : "bg-cream/40"
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-bold tracking-[0.25em] uppercase text-cream/90 z-10 bg-chocolate/40 backdrop-blur-sm px-3 py-2 rounded-xl border border-cream/5">
          <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
          <span>{product.delivery.available ? "Delivery available" : "Pickup only"}</span>
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
          {product.name}
        </h4>
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-chocolate/50 mt-1 select-none">
          View {product.name} Catalog
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
