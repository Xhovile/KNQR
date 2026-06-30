import React, { useState, useEffect } from "react";
import { ArrowLeft, Minus, Plus, ShoppingCart, Check, MoreHorizontal, X, Pencil, PackagePlus, BadgePercent, Share2, Sparkles, MessageCircle } from "lucide-react";
import { Product } from "./types";
import { motion, AnimatePresence } from "motion/react";

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  priceCurrency: "USD" | "MWK";
  onEditProduct?: (product: Product) => void;
}

export default function ProductDetailPage({
  product,
  onBack,
  onAddToCart,
  priceCurrency,
  onEditProduct,
}: ProductDetailPageProps) {
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

  const menuItems = [
    { label: "Edit", icon: Pencil },
    { label: "Restock", icon: PackagePlus },
    { label: "Record Sale", icon: BadgePercent },
    { label: "Share", icon: Share2 },
    { label: "Add to Cart", icon: ShoppingCart },
  ];

  const handlePlaceholderClick = (actionName: string) => {
    if (actionName === "Edit" && onEditProduct) {
      onEditProduct(product);
      setDropdownOpen(false);
      return;
    }
    if (actionName === "Add to Cart") {
      handleAddToCart();
      setDropdownOpen(false);
      return;
    }
    setActiveNotification(`${actionName} active`);
    setDropdownOpen(false);
    setTimeout(() => {
      setActiveNotification(null);
    }, 2500);
  };

  const imagesList = React.useMemo(() => {
    const list: string[] = [];
    if (product.image) {
      list.push(product.image);
    }
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        if (img && !list.includes(img)) {
          list.push(img);
        }
      });
    }
    return list.length > 0 ? list : [product.image].filter(Boolean) as string[];
  }, [product.image, product.images]);

  const displayPrice =
    priceCurrency === "USD"
      ? `$${product.priceUSD}`
      : `MK ${product.priceMWK.toLocaleString()}`;

  const otherPrice =
    priceCurrency === "USD"
      ? `MK ${product.priceMWK.toLocaleString()}`
      : `$${product.priceUSD}`;

  const statusLabel =
    product.status === "active"
      ? "Available"
      : product.status === "sold_out"
        ? "Sold out"
        : product.status === "draft"
          ? "Draft"
          : "Archived";

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen bg-light-brown text-chocolate flex flex-col"
      id="product-detail-page-container"
    >
      <div className="border-b border-chocolate/10 bg-white/40 backdrop-blur-md sticky top-0 z-30 py-4 px-6 md:px-12 flex items-center justify-between text-chocolate">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-chocolate/70 hover:text-gold font-sans text-xs tracking-widest uppercase transition-colors duration-200 cursor-pointer group"
          id="detail-back-button"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Curation</span>
        </button>

        <div className="flex items-center space-x-6">
          <span className="hidden sm:inline font-mono text-[9px] tracking-[0.4em] text-gold uppercase font-bold">
            KNQR / {product.category}
          </span>

          <div className="relative flex items-center">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-1.5 text-chocolate/50 hover:text-gold transition-colors duration-300 cursor-pointer flex items-center justify-center focus:outline-none"
              aria-label="Toggle details menu"
              id="details-menu-trigger-button"
            >
              {dropdownOpen ? <X className="w-5 h-5 text-gold" /> : <MoreHorizontal className="w-5 h-5" />}
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-black/5" onClick={() => setDropdownOpen(false)} />

                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-4 w-52 py-2.5 bg-white border border-chocolate/10 rounded-xl shadow-2xl z-50 origin-top-right backdrop-blur-md text-chocolate"
                    id="details-menu-dropdown-panel"
                  >
                    <div className="absolute top-0 right-4 -mt-1.5 w-3 h-3 bg-white border-t border-l border-chocolate/10 rotate-45" />

                    {menuItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handlePlaceholderClick(item.label)}
                        className="w-full text-left px-5 py-2.5 text-xs tracking-wider uppercase font-sans font-light text-chocolate/70 hover:text-gold hover:bg-chocolate/5 transition-all duration-200 flex items-center space-x-3 cursor-pointer"
                        id={`details-menu-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
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
      </div>

      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <div className="space-y-6 flex flex-col justify-start">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-chocolate/10 bg-white/40 shadow-lg">
            {imagesList.length > 0 && imagesList[activeImageIndex] ? (
              <img
                src={imagesList[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-500"
                referrerPolicy="no-referrer"
                id="detail-main-preview-image"
              />
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
              {imagesList.map((imgSrc, idx) => {
                const isSelected = idx === activeImageIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer shrink-0 ${
                      isSelected
                        ? "border-gold scale-105 shadow-md shadow-gold/10"
                        : "border-chocolate/15 opacity-60 hover:opacity-100 hover:scale-102"
                    }`}
                    id={`detail-thumb-${idx}`}
                  >
                    <img
                      src={imgSrc}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-start space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.4em] text-gold uppercase font-bold" id="detail-category-badge">
              {product.collectionCategory || product.category} Collection
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-chocolate font-semibold tracking-wide leading-tight" id="detail-product-name">
              {product.name}
            </h1>
            <div className="flex items-center flex-wrap gap-3 pt-1" id="detail-price-wrapper">
              <span className="font-mono text-xl md:text-2xl text-gold font-semibold tracking-wider">
                {displayPrice}
              </span>
              <span className="text-sm text-chocolate/40 line-through">
                ({otherPrice})
              </span>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.25em] uppercase ${
                product.status === "active" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
              }`}>
                {statusLabel}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-chocolate/10 bg-white/40 p-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold/80">Stock</p>
              <p className="mt-2 text-2xl font-semibold text-chocolate">{product.stock}</p>
            </div>
            <div className="rounded-2xl border border-chocolate/10 bg-white/40 p-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold/80">Delivery</p>
              <p className="mt-2 text-sm text-chocolate/80">
                {product.delivery.available ? product.delivery.methods.join(" • ") : "Pickup only"}
              </p>
            </div>
          </div>

          {product.delivery.note ? (
            <div className="rounded-2xl border border-chocolate/10 bg-white/30 p-4 text-sm text-chocolate/75 leading-relaxed">
              {product.delivery.note}
            </div>
          ) : null}

          <div className="border-t border-chocolate/10" />

          <div className="space-y-2">
            <h4 className="text-[10px] font-mono tracking-widest text-chocolate/40 uppercase">
              The Story
            </h4>
            <p className="text-sm font-sans font-light text-chocolate/80 leading-relaxed tracking-wide" id="detail-product-desc">
              {product.description}
            </p>
          </div>

          <div className="space-y-6">
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center select-none">
                  <span className="text-[10px] font-mono tracking-widest text-gold uppercase">
                    Select Size
                  </span>
                  <span className="text-[10px] font-sans text-chocolate/40 uppercase">
                    Fit Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 text-xs font-mono tracking-wider border rounded-lg transition-all cursor-pointer ${
                        selectedSize === size
                          ? "bg-chocolate text-cream border-chocolate font-semibold shadow-lg"
                          : "bg-white/40 border-chocolate/15 text-chocolate/70 hover:border-chocolate/40 hover:text-chocolate"
                      }`}
                      id={`detail-size-btn-${size.toLowerCase()}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-gold uppercase select-none">
                  Select Accent Color
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-2.5 text-xs font-sans tracking-wide border rounded-lg transition-all cursor-pointer ${
                        selectedColor === color
                          ? "bg-chocolate text-cream border-chocolate font-semibold shadow-lg"
                          : "bg-white/40 border-chocolate/15 text-chocolate/70 hover:border-chocolate/40 hover:text-chocolate"
                      }`}
                      id={`detail-color-btn-${color.toLowerCase().replace(" ", "-")}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {product.details && product.details.length > 0 && (
            <div className="space-y-3 border-t border-chocolate/10 pt-6">
              <span className="text-[10px] font-mono tracking-widest text-gold uppercase select-none">
                Sourcing & Specifications
              </span>
              <ul className="space-y-2.5 pl-1">
                {product.details.map((detail, index) => (
                  <li
                    key={index}
                    className="text-xs font-sans font-light text-chocolate/70 flex items-start space-x-2.5 leading-relaxed"
                  >
                    <span className="text-gold text-lg leading-none mt-0.5">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-chocolate/10" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-gold uppercase select-none">
                Order Quantity
              </span>
              <div className="flex items-center space-x-4 border border-chocolate/15 rounded-xl p-1 bg-white/40 shadow-sm text-chocolate">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-chocolate/70 hover:text-chocolate hover:bg-chocolate/5 rounded-lg transition-colors cursor-pointer"
                  id="detail-qty-decrement"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-mono text-sm text-chocolate px-3 font-semibold select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-chocolate/70 hover:text-chocolate hover:bg-chocolate/5 rounded-lg transition-colors cursor-pointer"
                  id="detail-qty-increment"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addedMessage}
              className={`w-full py-4 rounded-xl font-sans text-xs tracking-[0.3em] uppercase transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer shadow-xl font-semibold ${
                addedMessage
                  ? "bg-green-600 text-white"
                  : "bg-chocolate text-cream hover:bg-gold hover:text-chocolate hover:scale-[1.01]"
              }`}
              id="detail-add-to-cart-cta"
            >
              {addedMessage ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/265883184144?text=${encodeURIComponent(
                `Hello, I am interested in: ${product.name} (${displayPrice}). Size: ${selectedSize || 'Any'}, Color: ${selectedColor || 'Any'}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl border border-chocolate/20 text-chocolate hover:border-gold hover:text-gold hover:bg-chocolate/5 transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer text-xs tracking-[0.3em] uppercase font-semibold"
              id="detail-whatsapp-chat-cta"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#0b1b33]/95 border border-gold/40 text-cream px-6 py-3 rounded-full shadow-2xl text-xs font-mono tracking-widest uppercase flex items-center space-x-3"
            id="details-menu-notification-toast"
          >
            <span className="w-1.5 h-1.5 bg-gold rounded-full animate-ping" />
            <span className="text-gold/90 font-semibold">{activeNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
