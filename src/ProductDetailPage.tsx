import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, MoreHorizontal, Pencil, Share2, ShoppingBag, ShoppingCart, Sparkles, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "./types";

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  priceCurrency: "USD" | "MWK";
  onEditProduct?: (product: Product) => void;
  isAdmin?: boolean;
  onUpdateProduct?: (updatedProduct: Product) => Promise<void>;
  onTriggerAdminGuard?: (action: "add" | "edit" | "hero" | "restock" | "record_sale") => void;
}

function formatList(values?: string[]) {
  return values && values.length > 0 ? values.join(", ") : "—";
}

function formatMWK(value?: number | null) {
  return `MK ${(value || 0).toLocaleString()}`;
}

function formatUSD(value?: number | null) {
  return `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function specRows(product: Product): Array<{ label: string; value: string }> {
  const rows = [
    { label: "Collection", value: product.collectionCategory || "—" },
    { label: "Category", value: product.category || "—" },
    { label: "Status", value: product.status || "—" },
    { label: "Stock", value: `${product.stock ?? 0}` },
    { label: "Delivery", value: product.delivery?.available ? formatList(product.delivery.methods) : "Pickup only" },
  ];

  if (product.collectionCategory === "Apparel") {
    rows.push(
      { label: "Fit Profile", value: product.fit || "—" },
      { label: "Fabric Composition", value: product.material || "—" },
      { label: "Wear Profile", value: product.apparelGender || "—" },
      { label: "Sleeve Profile", value: product.sleeveType || "—" },
      { label: "Accent Colors", value: formatList(product.colors) }
    );
  } else if (product.collectionCategory === "Bags & Accessories") {
    rows.push(
      { label: "Accessory Type", value: product.bagType || "—" },
      { label: "Material Finish", value: product.bagMaterial || "—" },
      { label: "Carry Style", value: product.strapType || "—" },
      { label: "Capacity Profile", value: product.bagCapacity || "—" },
      { label: "Primary Use", value: product.useCase || "—" },
      { label: "Accent Colors", value: formatList(product.colors) }
    );
  } else if (product.collectionCategory === "Fragrances") {
    rows.push(
      { label: "Bottle Volume", value: product.volume || "—" },
      { label: "Scent Family", value: product.scentFamily || "—" },
      { label: "Wear Profile", value: product.fragranceGender || "—" },
      { label: "Concentration", value: product.concentration || "—" },
      { label: "Longevity", value: product.longevity || "—" },
      { label: "Notes", value: formatList(product.notes) }
    );
  }

  return rows;
}

function getVariantChips(product: Product): string[] {
  return product.collectionCategory === "Fragrances" ? (product.volume ? [product.volume] : []) : (product.sizes || []);
}

export default function ProductDetailPage({ product, onBack, onAddToCart, priceCurrency, onEditProduct }: ProductDetailPageProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  useEffect(() => {
    setSelectedSize(product.sizes?.[0] || "");
    setSelectedColor(product.colors?.[0] || "");
    setActiveImageIndex(0);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [product.id]);

  const imagesList = useMemo(() => {
    const list: string[] = [];
    if (product.image) list.push(product.image);
    product.images?.forEach((img) => {
      if (img && !list.includes(img)) list.push(img);
    });
    return list;
  }, [product.image, product.images]);

  const displayPrice = priceCurrency === "USD" ? formatUSD(product.priceUSD) : formatMWK(product.priceMWK);
  const secondaryPrice = priceCurrency === "USD" ? formatMWK(product.priceMWK) : formatUSD(product.priceUSD);
  const statusLabel = product.status === "active" ? "Available" : product.status === "sold_out" ? "Sold out" : product.status === "draft" ? "Draft" : "Archived";
  const variantChips = getVariantChips(product);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.24, ease: "easeOut" }} className="min-h-screen bg-light-brown text-chocolate flex flex-col pb-36" id="product-detail-page-container">
      <div className="border-b border-chocolate/10 bg-white/40 backdrop-blur-md sticky top-0 z-30 py-4 px-6 md:px-12 flex items-center justify-between text-chocolate">
        <button onClick={onBack} className="flex items-center space-x-2 text-chocolate/70 hover:text-gold font-sans text-xs tracking-widest uppercase transition-colors duration-200 cursor-pointer group" id="detail-back-button">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Curation</span>
        </button>
        <div className="relative flex items-center">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="p-1.5 text-chocolate/50 hover:text-gold transition-colors duration-300 cursor-pointer flex items-center justify-center focus:outline-none" aria-label="Toggle details menu" id="details-menu-trigger-button">
            {dropdownOpen ? <X className="w-5 h-5 text-gold" /> : <MoreHorizontal className="w-5 h-5" />}
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40 bg-black/5" onClick={() => setDropdownOpen(false)} />
                <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.18, ease: "easeOut" }} className="absolute right-0 top-full mt-4 w-52 py-2.5 bg-white border border-chocolate/10 rounded-xl shadow-2xl z-50 origin-top-right backdrop-blur-md text-chocolate" id="details-menu-dropdown-panel">
                  <div className="absolute top-0 right-4 -mt-1.5 w-3 h-3 bg-white border-t border-l border-chocolate/10 rotate-45" />
                  {[
                    { label: "Edit", icon: Pencil },
                    { label: "Share", icon: Share2 },
                    { label: "Add to Cart", icon: ShoppingCart },
                  ].map((item) => (
                    <button key={item.label} onClick={() => {
                      if (item.label === "Edit" && onEditProduct) onEditProduct(product);
                      if (item.label === "Add to Cart") handleAddToCart();
                      if (item.label === "Share") setActiveNotification("Share option active");
                      setDropdownOpen(false);
                    }} className="w-full text-left px-5 py-2.5 text-xs tracking-wider uppercase font-sans font-light text-chocolate/70 hover:text-gold hover:bg-chocolate/5 transition-all duration-200 flex items-center space-x-3 cursor-pointer" id={`details-menu-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      <item.icon className="w-3.5 h-3.5 text-gold/80" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <div className="space-y-6 flex flex-col justify-start">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-chocolate/10 bg-white/40 shadow-lg">
            {imagesList.length > 0 && imagesList[activeImageIndex] ? (
              <img src={imagesList[activeImageIndex]} alt={product.name} className="w-full h-full object-cover object-center transition-all duration-500" referrerPolicy="no-referrer" id="detail-main-preview-image" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-chocolate/5 p-8 text-center select-none">
                <Sparkles className="w-10 h-10 text-chocolate/20 mb-3 animate-pulse" />
                <span className="text-[11px] font-mono tracking-[0.3em] text-chocolate/40 uppercase">No Campaign Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/20 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-gold/40 rounded-tl-sm" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-gold/40 rounded-tr-sm" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-gold/40 rounded-bl-sm" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-gold/40 rounded-br-sm" />
          </div>

          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-2 scrollbar-thin select-none" id="detail-thumbnails-row">
              {imagesList.map((imgSrc, idx) => (
                <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer shrink-0 ${idx === activeImageIndex ? "border-gold scale-105 shadow-md shadow-gold/10" : "border-chocolate/15 opacity-60 hover:opacity-100 hover:scale-102"}`} id={`detail-thumb-${idx}`}>
                  <img src={imgSrc} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-start space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.4em] text-gold uppercase font-bold" id="detail-category-badge">{product.collectionCategory || product.category} Collection</span>
            <h1 className="font-serif text-3xl md:text-4xl text-chocolate font-semibold tracking-wide leading-tight" id="detail-product-name">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-3 pt-1" id="detail-price-wrapper">
              <span className="font-mono text-2xl md:text-3xl text-chocolate font-semibold tracking-wider">{displayPrice}</span>
              <span className="font-mono text-base md:text-lg text-gold font-semibold tracking-wider">{secondaryPrice}</span>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.25em] uppercase ${product.status === "active" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>{statusLabel}</span>
            </div>
          </div>

          {variantChips.length > 0 && (
            <div className="space-y-3 -mt-2" id="detail-variant-chips">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono tracking-widest text-gold uppercase select-none">{product.collectionCategory === "Fragrances" ? "Available Volumes" : "Available Sizes"}</span>
                {selectedSize && product.collectionCategory !== "Fragrances" && <span className="text-[10px] font-sans text-chocolate/40 uppercase">Selected: {selectedSize}</span>}
                {product.collectionCategory === "Fragrances" && getPrimaryVariantLabel(product) && <span className="text-[10px] font-sans text-chocolate/40 uppercase">{getPrimaryVariantLabel(product)}</span>}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {variantChips.map((variant) => (
                  <button key={variant} type="button" onClick={() => setSelectedSize(variant)} className={`px-4 py-2 rounded-lg border text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${selectedSize === variant ? "bg-chocolate text-cream border-chocolate" : "bg-white/60 border-chocolate/15 text-chocolate/70 hover:border-chocolate/35 hover:text-chocolate"}`} id={`detail-variant-chip-${variant.toLowerCase().replace(/\s+/g, "-")}`}>{variant}</button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-chocolate/10 bg-white p-5 flex flex-col justify-between shadow-sm relative overflow-hidden" id="detail-stock-card">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-mono font-bold">Inventory status</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl font-serif text-chocolate">{product.stock}</span>
                  <span className="text-xs text-chocolate/40 font-mono">/ {(product.stock + (product.sold || 0))} total units</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-chocolate/5 flex justify-between text-[11px] font-mono text-chocolate/60">
                <span className="flex items-center"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5" />AVAILABLE: {product.stock}</span>
                <span className="flex items-center"><span className="w-1.5 h-1.5 bg-gold rounded-full mr-1.5" />SOLD: {product.sold || 0}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-chocolate/10 bg-white p-5 flex flex-col justify-between shadow-sm relative overflow-hidden" id="detail-delivery-card">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-mono font-bold">Delivery & Fulfilment</span>
                <p className="mt-3 text-sm text-chocolate/80 leading-relaxed font-sans font-light">{product.delivery.available ? product.delivery.methods.join(" • ") : "Pickup only"}</p>
              </div>
              {product.delivery.note ? <p className="mt-4 pt-3 border-t border-chocolate/5 text-sm text-chocolate/75 leading-relaxed font-sans">{product.delivery.note}</p> : null}
              <div className="mt-4 pt-3 border-t border-chocolate/5 text-[10px] font-mono text-chocolate/50 uppercase tracking-widest">EST. DELIVERY: 1-3 DAYS</div>
            </div>
          </div>

          <div className="rounded-2xl border border-chocolate/10 bg-white p-5 shadow-sm space-y-3" id="detail-description-card">
            <div className="flex items-center justify-between gap-3 border-b border-chocolate/10 pb-3">
              <h4 className="text-[10px] font-mono tracking-widest text-gold uppercase select-none">Product Description</h4>
              <span className="text-[10px] font-mono tracking-[0.25em] text-chocolate/35 uppercase">Overview</span>
            </div>
            <p className="text-sm font-sans font-light text-chocolate/85 leading-relaxed tracking-wide" id="detail-product-desc">{product.description}</p>
          </div>

          <div className="space-y-3 border-t border-chocolate/10 pt-6" id="product-specifications-section">
            <span className="text-[10px] font-mono tracking-widest text-gold uppercase select-none">Product Specifications</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specRows(product).map((row) => (
                <div key={row.label} className="rounded-xl border border-chocolate/10 bg-white/60 px-4 py-3">
                  <p className="text-[9px] font-mono tracking-[0.25em] uppercase text-chocolate/40">{row.label}</p>
                  <p className="mt-1 text-sm text-chocolate/80 leading-relaxed">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          {product.details && product.details.length > 0 && (
            <div className="space-y-3 border-t border-chocolate/10 pt-6">
              <span className="text-[10px] font-mono tracking-widest text-gold uppercase select-none">Selected Highlights</span>
              <div className="flex flex-wrap gap-2">
                {product.details.map((detail, index) => (
                  <span key={index} className="inline-flex items-center rounded-full border border-chocolate/10 bg-white px-3 py-1 text-[11px] text-chocolate/70">{detail}</span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-chocolate/10" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-gold uppercase select-none">Order Quantity</span>
              <div className="flex items-center space-x-4 border border-chocolate/15 rounded-xl p-1 bg-white/40 shadow-sm text-chocolate">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-chocolate/70 hover:text-chocolate hover:bg-chocolate/5 rounded-lg transition-colors cursor-pointer" id="detail-qty-decrement"><Minus className="w-4 h-4" /></button>
                <span className="font-mono text-sm text-chocolate px-3 font-semibold select-none">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-chocolate/70 hover:text-chocolate hover:bg-chocolate/5 rounded-lg transition-colors cursor-pointer" id="detail-qty-increment"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <button onClick={() => { setActiveNotification("Direct Card payment integration is currently offline. Please use Add to Cart or WhatsApp checkout."); setTimeout(() => setActiveNotification(null), 4000); }} className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-cream transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer shadow-xl font-sans text-xs tracking-[0.3em] uppercase font-semibold hover:scale-[1.01]" id="detail-buy-now-cta">
              <ShoppingBag className="w-4 h-4" />
              <span>Buy Now</span>
            </button>

            <button onClick={handleAddToCart} disabled={addedMessage} className={`w-full py-4 rounded-xl font-sans text-xs tracking-[0.3em] uppercase transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer shadow-xl font-semibold ${addedMessage ? "bg-green-600 text-white" : "bg-chocolate text-cream hover:bg-gold hover:text-chocolate hover:scale-[1.01]"}`} id="detail-add-to-cart-cta">
              {addedMessage ? <><Check className="w-4 h-4" /><span>Added to Cart</span></> : <><ShoppingCart className="w-4 h-4" /><span>Add to Cart</span></>}
            </button>

            <a href={`https://wa.me/265883184144?text=${encodeURIComponent(`Hello, I am interested in: ${product.name} (${displayPrice}). Size: ${selectedSize || "Any"}, Color: ${selectedColor || "Any"}.`)}`} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-xl border border-chocolate/20 text-chocolate hover:border-gold hover:text-gold hover:bg-chocolate/5 transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer text-xs tracking-[0.3em] uppercase font-semibold" id="detail-whatsapp-chat-cta">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeNotification && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#0b1b33]/95 border border-gold/40 text-cream px-6 py-3 rounded-full shadow-2xl text-xs font-mono tracking-widest uppercase flex items-center space-x-3" id="details-menu-notification-toast">
            <span className="w-1.5 h-1.5 bg-gold rounded-full animate-ping" />
            <span className="text-gold/90 font-semibold">{activeNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
