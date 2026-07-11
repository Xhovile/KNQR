import React, { useDeferredValue, useMemo, useState } from "react";
import { ArrowUpDown, RefreshCw, Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "./types";
import ProductCard from "./components/ProductCard";

interface ShopProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; value: string }) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
  priceCurrency: "USD" | "MWK";
}

type SortOption =
  | "price-asc"
  | "price-desc"
  | "modified-new"
  | "modified-old"
  | "delivery-available"
  | "delivery-unavailable";

interface ShopControlsProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  categories: string[];
  onResetFilters: () => void;
}

const ShopControls = React.memo(function ShopControls({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  onResetFilters,
}: ShopControlsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const hasSearch = searchQuery.trim().length > 0;
  const hasCategory = selectedCategory !== "All";
  const hasSort = sortBy !== "modified-new";
  const hasActiveFilters = hasSearch || hasCategory || hasSort;

  const closePanels = () => {
    setShowFilters(false);
    setShowSort(false);
  };

  return (
    <div
      className="bg-white/40 border border-chocolate/10 rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 space-y-4 relative z-10 backdrop-blur-md shadow-sm"
      id="shop-controls-container"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-chocolate/40">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search catalog by name, details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-white/80 text-chocolate placeholder-chocolate/40 border border-chocolate/10 rounded-xl text-xs font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-light"
              id="shop-search-input"
            />
            {hasSearch && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center justify-center pr-3 text-chocolate/35 hover:text-chocolate/80 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center justify-end gap-3">
            <button
              onClick={() => {
                if (showSort) {
                  setShowSort(false);
                  setShowFilters(true);
                } else {
                  setShowFilters((v) => !v);
                  setShowSort(false);
                }
              }}
              className={`px-4 py-3 border rounded-xl text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer w-full sm:w-auto ${
                showFilters || hasCategory
                  ? "border-chocolate text-chocolate bg-chocolate/5 font-semibold"
                  : "border-chocolate/10 text-chocolate/70 hover:text-chocolate hover:border-chocolate/35 bg-white/40"
              }`}
              id="shop-filter-toggle-btn"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {hasCategory ? `(${selectedCategory})` : ""}</span>
            </button>

            <button
              onClick={() => {
                if (showFilters) {
                  setShowFilters(false);
                  setShowSort(true);
                } else {
                  setShowSort((v) => !v);
                  setShowFilters(false);
                }
              }}
              className={`px-4 py-3 border rounded-xl text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer w-full sm:w-auto ${
                showSort || hasSort
                  ? "border-chocolate text-chocolate bg-chocolate/5 font-semibold"
                  : "border-chocolate/10 text-chocolate/70 hover:text-chocolate hover:border-chocolate/35 bg-white/40"
              }`}
              id="shop-sort-toggle-btn"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>
                Sort: {sortBy === "price-desc"
                  ? "Price: High"
                  : sortBy === "price-asc"
                    ? "Price: Low"
                    : sortBy === "modified-new"
                      ? "Newest"
                      : sortBy === "modified-old"
                        ? "Oldest"
                        : sortBy === "delivery-available"
                          ? "Delivery"
                          : "No Delivery"}
              </span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="px-4 py-3 rounded-xl text-xs font-mono tracking-wider uppercase border border-chocolate/10 bg-white/60 text-chocolate/70 hover:text-chocolate hover:border-chocolate/30 transition-all cursor-pointer w-full sm:w-auto"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-chocolate/10 bg-white/50 px-4 py-3 text-[10px] font-mono uppercase tracking-[0.25em] text-chocolate/60">
            <span>
              {hasSearch ? "Search active" : ""}
              {hasSearch && hasCategory ? " • " : ""}
              {hasCategory ? `Category: ${selectedCategory}` : ""}
              {(hasSearch || hasCategory) && hasSort ? " • " : ""}
              {hasSort ? "Sort changed" : ""}
            </span>
            <button
              type="button"
              onClick={onResetFilters}
              className="text-chocolate/70 hover:text-chocolate transition-colors"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {(showFilters || (hasCategory && !showSort)) && (
        <div className="border-t border-chocolate/5 pt-4" id="shop-expandable-filters">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-mono uppercase text-chocolate/45 mr-2">Collections:</span>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? "bg-chocolate text-cream font-bold shadow-md shadow-chocolate/10"
                        : "bg-white/60 hover:bg-white border border-chocolate/10 text-chocolate/70 hover:text-chocolate"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={closePanels}
              className="px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider border border-chocolate/10 bg-white/60 text-chocolate/65 hover:text-chocolate transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showSort && (
        <div className="border-t border-chocolate/5 pt-4" id="shop-expandable-sort">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-mono uppercase text-chocolate/45 mr-2">Sort By:</span>
              {[
                { value: "price-desc", label: "Price: High" },
                { value: "price-asc", label: "Price: Low" },
                { value: "modified-new", label: "Modified: New" },
                { value: "modified-old", label: "Modified: Old" },
                { value: "delivery-available", label: "Delivery: Available" },
                { value: "delivery-unavailable", label: "Delivery: Not Available" },
              ].map((opt) => {
                const isSelected = sortBy === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value as SortOption)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? "bg-chocolate text-cream font-bold shadow-md shadow-chocolate/10"
                        : "bg-white/60 hover:bg-white border border-chocolate/10 text-chocolate/70 hover:text-chocolate"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={closePanels}
              className="px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider border border-chocolate/10 bg-white/60 text-chocolate/65 hover:text-chocolate transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

interface ProductGridProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; value: string }) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
  handleResetFilters: () => void;
}

const ProductGrid = React.memo(function ProductGrid({
  products,
  onViewDetails,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  handleResetFilters,
}: ProductGridProps) {
  return (
    <div className="relative z-10 flex-grow" id="shop-cards-grid-wrapper">
      {products.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6"
          id="shop-products-grid"
        >
          <AnimatePresence mode="popLayout">
            {products.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onViewDetails}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={isWishlisted}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div
          className="flex flex-col items-center justify-center text-center py-24 px-6 border border-chocolate/10 rounded-2xl bg-white/20 backdrop-blur-xs space-y-6"
          id="shop-empty-state"
        >
          <div className="w-16 h-16 bg-chocolate/5 border border-chocolate/10 rounded-full flex items-center justify-center text-chocolate/30">
            <RefreshCw className="w-6 h-6 animate-spin-slow text-chocolate/50" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-xl tracking-wide text-chocolate">No products match your selection</h3>
            <p className="text-xs text-chocolate/60 max-w-xs mx-auto leading-relaxed font-light">
              Adjust your filters or search, or restore the catalog to continue browsing.
            </p>
          </div>

          <button
            onClick={handleResetFilters}
            className="px-6 py-3 bg-chocolate hover:bg-chocolate-light text-cream font-mono text-xs tracking-widest uppercase font-bold rounded-xl transition-all cursor-pointer shadow-lg"
            id="shop-reset-filters-btn"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
});

export default function Shop({
  products,
  onViewDetails,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  priceCurrency,
}: ShopProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("modified-new");

  const categories = useMemo(() => {
    const list = products.map((p) => p.collectionCategory || p.category || "Apparel");
    return ["All", ...Array.from(new Set(list))];
  }, [products]);

  const productOrder = useMemo(() => new Map(products.map((p, index) => [p.id, index])), [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter((p) => (p.collectionCategory || p.category || "Apparel") === selectedCategory);
    }

    const q = deferredSearchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.collectionCategory && p.collectionCategory.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (priceCurrency === "USD" ? a.priceUSD - b.priceUSD : a.priceMWK - b.priceMWK));
        break;
      case "price-desc":
        result.sort((a, b) => (priceCurrency === "USD" ? b.priceUSD - a.priceUSD : b.priceMWK - a.priceMWK));
        break;
      case "modified-new":
        result.sort((a, b) => (productOrder.get(a.id) ?? 0) - (productOrder.get(b.id) ?? 0));
        break;
      case "modified-old":
        result.sort((a, b) => (productOrder.get(b.id) ?? 0) - (productOrder.get(a.id) ?? 0));
        break;
      case "delivery-available":
        result.sort((a, b) => Number((b.delivery?.available ?? false)) - Number((a.delivery?.available ?? false)));
        break;
      case "delivery-unavailable":
        result.sort((a, b) => Number((a.delivery?.available ?? false)) - Number((b.delivery?.available ?? false)));
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, deferredSearchQuery, sortBy, priceCurrency, productOrder]);

  const handleResetFilters = React.useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("modified-new");
  }, []);

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow flex flex-col animate-fadeIn" id="knqr-shop-container">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none select-none z-0" />

      <div className="text-center mb-10 sm:mb-12 relative z-10" id="shop-header-text">
        <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-chocolate uppercase mb-4">
          All Products
        </h2>
        <div className="w-16 h-[1px] bg-chocolate/30 mx-auto mb-4" />
        <p className="text-xs font-mono tracking-[0.3em] uppercase text-chocolate/70">Tailored Premium Essentials</p>
      </div>

      <ShopControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categories}
        onResetFilters={handleResetFilters}
      />

      <ProductGrid
        products={filteredAndSortedProducts}
        onViewDetails={onViewDetails}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlist={wishlist}
        handleResetFilters={handleResetFilters}
      />
    </section>
  );
}
