import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BadgePercent, Check, MessageCircle, Minus, MoreHorizontal, PackagePlus, Pencil, Plus, Share2, ShoppingBag, ShoppingCart, Sparkles, X } from "lucide-react";
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

const fmtList = (value?: string[]) => (value && value.length ? value.join(", ") : "");
const fmtMWK = (value?: number | null) => `MK ${(value || 0).toLocaleString()}`;
const fmtUSD = (value?: number | null) => `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function pushIf(rows: Array<[string, string]>, label: string, value?: string | null) {
  const trimmed = (value || "").trim();
  if (trimmed) rows.push([label, trimmed]);
}

function specRows(product: Product): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["Collection", product.collectionCategory || "—"],
    ["Category", product.category || "—"],
    ["Status", product.status || "—"],
    ["Stock", `${product.stock ?? 0}`],
    ["Delivery", product.delivery?.available ? (product.delivery.methods?.length ? product.delivery.methods.join(", ") : "Pickup") : "Pickup only"],
  ];

  if (product.collectionCategory === "Apparel") {
    pushIf(rows, "Fit Profile", product.fit);
    pushIf(rows, "Fabric Composition", product.material);
    pushIf(rows, "Wear Profile", product.apparelGender);
    pushIf(rows, "Sleeve Profile", product.sleeveType);
    if (product.colors?.length) rows.push(["Accent Colors", product.colors.join(", ")]);
  } else if (product.collectionCategory === "Bags & Accessories") {
    pushIf(rows, "Accessory Type", product.bagType);
    pushIf(rows, "Material Finish", product.bagMaterial);
    pushIf(rows, "Carry Style", product.strapType);
    pushIf(rows, "Capacity Profile", product.bagCapacity);
    pushIf(rows, "Primary Use", product.useCase);
    if (product.colors?.length) rows.push(["Accent Colors", product.colors.join(", ")]);
  } else if (product.collectionCategory === "Accessories") {
    pushIf(rows, "Accessory Type", product.accessoryType);
    pushIf(rows, "Material Finish", product.accessoryMaterial);
    pushIf(rows, "Style Profile", product.accessoryStyle);
    pushIf(rows, "Primary Use", product.accessoryUseCase);
    if (product.colors?.length) rows.push(["Accent Colors", product.colors.join(", ")]);
  } else if (product.collectionCategory === "Fragrances") {
    pushIf(rows, "Bottle Volume", product.volume);
    pushIf(rows, "Scent Family", product.scentFamily);
    pushIf(rows, "Wear Profile", product.fragranceGender);
    pushIf(rows, "Concentration", product.concentration);
    pushIf(rows, "Longevity", product.longevity);
    if (product.notes?.length) rows.push(["Notes", product.notes.join(", ")]);
  }

  return rows;
}

export default function ProductDetailPage({
  product,
  onBack,
  onAddToCart,
  priceCurrency,
  onEditProduct,
  isAdmin,
  onUpdateProduct,
  onTriggerAdminGuard,
}: ProductDetailPageProps) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState(product.sizes?.[0] || "");
  const [color, setColor] = useState(product.colors?.[0] || "");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showRecordSaleModal, setShowRecordSaleModal] = useState(false);
  const [restockAmount, setRestockAmount] = useState(10);
  const [saleAmount, setSaleAmount] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setQty(1);
    setImageIndex(0);
    setSize(product.sizes?.[0] || "");
    setColor(product.colors?.[0] || "");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [product.id]);

  const images = useMemo(() => {
    const out: string[] = [];
    if (product.image) out.push(product.image);
    product.images?.forEach((u) => {
      if (u && !out.includes(u)) out.push(u);
    });
    return out;
  }, [product]);

  const primary = priceCurrency === "USD" ? fmtUSD(product.priceUSD) : fmtMWK(product.priceMWK);
  const secondary = priceCurrency === "USD" ? fmtMWK(product.priceMWK) : fmtUSD(product.priceUSD);
  const variantChips = product.collectionCategory === "Fragrances" ? (product.volume ? [product.volume] : []) : (product.sizes || []);
  const deliveryText = product.delivery?.available ? (product.delivery.methods?.length ? product.delivery.methods.join(" • ") : "Pickup") : "Pickup only";
  const deliveryNote = product.delivery?.note || "";

  const add = () => {
    onAddToCart(product, qty, size, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const runRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      onTriggerAdminGuard?.("restock");
      return;
    }
    if (!onUpdateProduct) return;
    if (restockAmount <= 0) {
      setModalError("Enter a valid quantity.");
      return;
    }

    setIsUpdating(true);
    setModalError(null);
    try {
      const currentStock = product.stock || 0;
      const currentSold = product.sold || 0;
      await onUpdateProduct({
        ...product,
        stock: currentStock + restockAmount,
        totalStock: (product.totalStock || currentStock + currentSold) + restockAmount,
      });
      setShowRestockModal(false);
      setToast(`Restocked +${restockAmount}`);
      setTimeout(() => setToast(null), 2200);
    } catch (err: any) {
      setModalError(err?.message || "Failed to update stock.");
    } finally {
      setIsUpdating(false);
    }
  };

  const runSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      onTriggerAdminGuard?.("record_sale");
      return;
    }
    if (!onUpdateProduct) return;
    if (saleAmount <= 0) {
      setModalError("Enter a valid quantity.");
      return;
    }
    if (saleAmount > (product.stock || 0)) {
      setModalError(`Only ${product.stock || 0} units available.`);
      return;
    }

    setIsUpdating(true);
    setModalError(null);
    try {
      const currentStock = product.stock || 0;
      const currentSold = product.sold || 0;
      const nextStock = currentStock - saleAmount;
      await onUpdateProduct({
        ...product,
        stock: nextStock,
        sold: currentSold + saleAmount,
        status: nextStock === 0 ? "sold_out" : product.status,
      });
      setShowRecordSaleModal(false);
      setToast(`Recorded sale of ${saleAmount}`);
      setTimeout(() => setToast(null), 2200);
    } catch (err: any) {
      setModalError(err?.message || "Failed to record sale.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} className="min-h-screen bg-light-brown text-chocolate pb-36">
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-chocolate/10 bg-white/40 px-6 py-4 backdrop-blur-md">
        <button onClick={onBack} className="flex items-center gap-2 text-xs uppercase tracking-widest text-chocolate/70 hover:text-gold">
          <ArrowLeft className="h-4 w-4" />
          Back to Curation
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-2 text-chocolate/60 transition hover:bg-chocolate/5 hover:text-gold"
            aria-label="Details menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute right-0 top-full z-50 mt-3 w-52 overflow-hidden rounded-2xl border border-chocolate/10 bg-white shadow-2xl"
                >
                  {[
                    { label: "Edit", icon: Pencil, run: () => onEditProduct?.(product) },
                    { label: "Restock", icon: PackagePlus, run: () => { setModalError(null); setRestockAmount(10); setShowRestockModal(true); } },
                    { label: "Record Sale", icon: BadgePercent, run: () => { setModalError(null); setSaleAmount(1); setShowRecordSaleModal(true); } },
                    { label: "Share", icon: Share2, run: () => setToast("Share option opened") },
                    { label: "Add to Cart", icon: ShoppingCart, run: add },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.run();
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-xs uppercase tracking-wider text-chocolate/70 transition hover:bg-chocolate/5 hover:text-gold"
                    >
                      <item.icon className="h-4 w-4 text-gold/80" />
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-8 md:grid-cols-2 md:gap-16 md:py-16">
        <div className="space-y-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-chocolate/10 bg-white/40 shadow-lg">
            {images[imageIndex] ? (
              <img src={images[imageIndex]} alt={product.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-chocolate/5 text-center">
                <Sparkles className="mb-3 h-10 w-10 animate-pulse text-chocolate/20" />
                <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-chocolate/40">No Campaign Image</span>
              </div>
            )}
          </div>

          {images.length > 1 ? (
            <div className="flex gap-3 overflow-x-auto py-2">
              {images.map((src, i) => (
                <button key={src + i} onClick={() => setImageIndex(i)} className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${i === imageIndex ? "border-gold" : "border-chocolate/15 opacity-60"}`}>
                  <img src={src} alt={`${product.name} thumbnail ${i + 1}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-gold">{product.collectionCategory || product.category} Collection</div>
            <h1 className="font-serif text-3xl font-semibold leading-tight text-chocolate md:text-4xl">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-2xl font-semibold tracking-wider text-chocolate md:text-3xl">{primary}</span>
              <span className="font-mono text-base font-semibold tracking-wider text-gold md:text-lg">{secondary}</span>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] ${product.status === "active" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
                {product.status === "active" ? "Available" : product.status}
              </span>
            </div>
          </div>

          {variantChips.length > 0 ? (
            <div className="space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-gold">{product.collectionCategory === "Fragrances" ? "Available Volumes" : "Available Sizes"}</div>
              <div className="flex flex-wrap gap-2.5">
                {variantChips.map((v) => (
                  <button key={v} onClick={() => setSize(v)} className={`rounded-lg border px-4 py-2 text-xs font-mono uppercase tracking-wider ${size === v ? "border-chocolate bg-chocolate text-cream" : "border-chocolate/15 bg-white/60 text-chocolate/70"}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-chocolate/10 bg-white p-5 shadow-sm">
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gold">Inventory status</div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-serif text-3xl text-chocolate">{product.stock ?? 0}</span>
                <span className="text-xs font-mono text-chocolate/40">/ {(product.stock ?? 0) + (product.sold || 0)} total units</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-chocolate/5 pt-3 text-[11px] font-mono text-chocolate/60">
                <span className="flex items-center"><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />AVAILABLE: {product.stock ?? 0}</span>
                <span className="flex items-center"><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-gold" />SOLD: {product.sold || 0}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-chocolate/10 bg-white p-5 shadow-sm">
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gold">Delivery & Fulfilment</div>
              <p className="mt-3 text-sm leading-relaxed text-chocolate/80">{deliveryText}</p>
              {deliveryNote ? <p className="mt-4 border-t border-chocolate/5 pt-3 text-sm leading-relaxed text-chocolate/75">{deliveryNote}</p> : null}
              <div className="mt-4 border-t border-chocolate/5 pt-3 text-[10px] font-mono uppercase tracking-widest text-chocolate/50">EST. DELIVERY: 1-3 DAYS</div>
            </div>
          </div>

          <div className="rounded-2xl border border-chocolate/10 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-chocolate/10 pb-3">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-gold">Product Description</h4>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-chocolate/35">Overview</span>
            </div>
            <p className="text-sm leading-relaxed tracking-wide text-chocolate/85">{product.description || "No description provided."}</p>
          </div>

          <div className="space-y-3 border-t border-chocolate/10 pt-6">
            <div className="text-[10px] font-mono uppercase tracking-widest text-gold">Product Specifications</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {specRows(product).map(([label, value]) => (
                <div key={label} className="rounded-xl border border-chocolate/10 bg-white/60 px-4 py-3">
                  <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-chocolate/40">{label}</div>
                  <div className="mt-1 text-sm leading-relaxed text-chocolate/80">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {product.details?.length ? (
            <div className="space-y-3 border-t border-chocolate/10 pt-6">
              <div className="text-[10px] font-mono uppercase tracking-widest text-gold">Selected Highlights</div>
              <div className="flex flex-wrap gap-2">
                {product.details.map((d) => (
                  <span key={d} className="rounded-full border border-chocolate/10 bg-white px-3 py-1 text-[11px] text-chocolate/70">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold">Order Quantity</span>
              <div className="flex items-center space-x-4 rounded-xl border border-chocolate/15 bg-white/40 p-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="rounded-lg p-2 text-chocolate/70 hover:bg-chocolate/5"><Minus className="h-4 w-4" /></button>
                <span className="px-3 font-mono text-sm font-semibold text-chocolate">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="rounded-lg p-2 text-chocolate/70 hover:bg-chocolate/5"><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            <button
              onClick={() => setToast("Payments are coming soon. Please use Add to Cart or WhatsApp checkout.")}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-600 px-4 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-cream transition hover:bg-orange-500"
            >
              <ShoppingBag className="h-4 w-4" />
              Buy Now
            </button>

            <button onClick={add} disabled={added} className={`flex w-full items-center justify-center gap-3 rounded-xl px-4 py-4 text-xs font-semibold uppercase tracking-[0.3em] transition ${added ? "bg-green-600 text-white" : "bg-chocolate text-cream hover:bg-gold hover:text-chocolate"}`}>
              {added ? <><Check className="h-4 w-4" />Added to Cart</> : <><ShoppingCart className="h-4 w-4" />Add to Cart</>}
            </button>

            <a
              href={`https://wa.me/265883184144?text=${encodeURIComponent(
                `Hello, I am interested in: ${product.name} (${primary}). Size: ${size || "Any"}, Color: ${color || "Any"}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-chocolate/20 px-4 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-chocolate transition hover:border-gold hover:bg-chocolate/5 hover:text-gold"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="fixed left-1/2 top-24 z-50 -translate-x-1/2 rounded-full border border-gold/40 bg-[#0b1b33]/95 px-6 py-3 text-xs font-mono uppercase tracking-widest text-cream shadow-2xl"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showRestockModal ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4">
            <form onSubmit={runRestock} className="w-full max-w-sm rounded-2xl border border-chocolate/10 bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-lg text-chocolate">Restock Inventory</h3>
                <button type="button" onClick={() => setShowRestockModal(false)}><X className="h-5 w-5 text-chocolate/60" /></button>
              </div>
              {modalError ? <p className="mb-3 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">{modalError}</p> : null}
              <label className="mb-2 block text-[10px] font-mono uppercase tracking-widest text-chocolate/50">Quantity</label>
              <input type="number" min="1" value={restockAmount} onChange={(e) => setRestockAmount(Math.max(1, parseInt(e.target.value) || 0))} className="w-full rounded-xl border border-chocolate/15 px-4 py-3 text-sm outline-none" />
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => setShowRestockModal(false)} className="flex-1 rounded-xl border border-chocolate/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-chocolate/70">Cancel</button>
                <button type="submit" disabled={isUpdating} className="flex-1 rounded-xl bg-chocolate px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-cream">{isUpdating ? "Saving..." : "Confirm"}</button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showRecordSaleModal ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4">
            <form onSubmit={runSale} className="w-full max-w-sm rounded-2xl border border-chocolate/10 bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-lg text-chocolate">Record Sale</h3>
                <button type="button" onClick={() => setShowRecordSaleModal(false)}><X className="h-5 w-5 text-chocolate/60" /></button>
              </div>
              {modalError ? <p className="mb-3 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">{modalError}</p> : null}
              <label className="mb-2 block text-[10px] font-mono uppercase tracking-widest text-chocolate/50">Quantity</label>
              <input type="number" min="1" value={saleAmount} onChange={(e) => setSaleAmount(Math.max(1, parseInt(e.target.value) || 0))} className="w-full rounded-xl border border-chocolate/15 px-4 py-3 text-sm outline-none" />
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => setShowRecordSaleModal(false)} className="flex-1 rounded-xl border border-chocolate/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-chocolate/70">Cancel</button>
                <button type="submit" disabled={isUpdating} className="flex-1 rounded-xl bg-chocolate px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-cream">{isUpdating ? "Saving..." : "Confirm"}</button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
