import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import { ArrowUp, ShoppingCart, X } from "lucide-react";

import CartPage from "./CartPage";
import Skeleton from "./components/Skeleton";
import AdminGuardModal from "./components/AdminGuardModal";
import CatalogView from "./components/CatalogView";

import { Product } from "./types";
import { HeroImages, updateHeroImageInDb } from "./services/productService";
import { ProductDraftValues } from "./productSchema";
import ProductDetailPage from "./ProductDetailPage";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import { buildProductFromDraft } from "./lib/productPayload";

import { useAuthSession } from "./hooks/useAuthSession";
import { useProductsBootstrap } from "./hooks/useProductsBootstrap";
import { useCartState } from "./hooks/useCartState";
import { useAppNavigation } from "./hooks/useAppNavigation";

const HERO_CACHE_KEY = "knqr.hero-images.cache.v1";
const SETTINGS_STORAGE_KEY = "knqr.user.settings.v1";
const SETTINGS_UPDATED_EVENT = "knqr:settings-updated";

type AppearanceMode = "system" | "light" | "dark";

function readAppearanceMode(): AppearanceMode {
  if (typeof window === "undefined") return "system";

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return "system";
    const parsed = JSON.parse(raw) as { appearance?: AppearanceMode };
    return parsed.appearance === "light" || parsed.appearance === "dark" ? parsed.appearance : "system";
  } catch {
    return "system";
  }
}

function resolveAppearance(mode: AppearanceMode): "light" | "dark" {
  if (mode === "system") {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  }

  return mode;
}

export default function App() {
  const [priceCurrency] = useState<"USD" | "MWK">("MWK");
  const [showAdminGuardModal, setShowAdminGuardModal] = useState(false);
  const [adminGuardAction, setAdminGuardAction] = useState<"add" | "edit" | "hero" | "restock" | "record_sale" | null>(null);
  const [authInitialIsSignUp, setAuthInitialIsSignUp] = useState(false);
  const [appearanceMode, setAppearanceMode] = useState<AppearanceMode>(() => readAppearanceMode());

  const { user, handleSignOut: signOutFromAuth } = useAuthSession();

  const {
    productsList,
    setProductsList,
    isLoadingProducts,
    heroImages,
    setHeroImages,
    productsError,
  } = useProductsBootstrap();

  const {
    cart,
    setIsCartOpen,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
  } = useCartState();

  const {
    activeTab,
    selectedProduct,
    setSelectedProduct,
    isCreatingProduct,
    setIsCreatingProduct,
    editingProduct,
    setEditingProduct,
    transitionTo,
    handleGoBack,
    handleNavigation,
    activeTabRef,
  } = useAppNavigation({ productsList });

  useEffect(() => {
    const syncAppearance = () => setAppearanceMode(readAppearanceMode());
    syncAppearance();
    window.addEventListener(SETTINGS_UPDATED_EVENT, syncAppearance);
    window.addEventListener("storage", syncAppearance);
    return () => {
      window.removeEventListener(SETTINGS_UPDATED_EVENT, syncAppearance);
      window.removeEventListener("storage", syncAppearance);
    };
  }, []);

  useEffect(() => {
    const resolved = resolveAppearance(appearanceMode);
    document.documentElement.dataset.appearance = appearanceMode;
    document.documentElement.dataset.resolvedAppearance = resolved;
    document.body.dataset.appearance = appearanceMode;
    document.body.dataset.resolvedAppearance = resolved;
    document.body.style.colorScheme = resolved;
  }, [appearanceMode]);

  const isAdmin = user && user.email === "xhovilepublications@gmail.com";
  const isCartPage = activeTab === "cart";
  const resolvedAppearance = resolveAppearance(appearanceMode);

  const handleSignOut = async () => {
    await signOutFromAuth(() => transitionTo("home"));
  };

  const handleUpdateHeroImage = async (page: keyof HeroImages, url: string) => {
    try {
      const next = { ...heroImages, [page]: url };
      setHeroImages(next);
      try {
        window.localStorage.setItem(HERO_CACHE_KEY, JSON.stringify(next));
      } catch {
        // ignore cache write failures
      }
      await updateHeroImageInDb(page, url);
    } catch (err: any) {
      console.error(`Failed to update hero image for page ${page}:`, err?.message || String(err));
      alert("Failed to save customizable hero image. Please try again.");
      throw new Error(err?.message || String(err));
    }
  };

  const handleUpdateHomeHero = useCallback((url: string) => handleUpdateHeroImage("home", url), []);
  const handleToggleWishlist = useCallback(() => {}, []);
  const [wishlist] = useState<string[]>([]);

  const handleViewDetails = useCallback(
    (product: Product) => {
      transitionTo(activeTabRef.current, product, false, null);
    },
    [activeTabRef, transitionTo]
  );

  const handleAddToCartFromShop = useCallback(
    (product: Product, size: string, color: { name: string; value: string }) =>
      handleAddToCart(product, 1, size, color.name),
    [handleAddToCart]
  );

  const handleAddToCartFromPages = useCallback(
    (product: Product, size: string, color: { name: string; value: string }) =>
      handleAddToCart(product, 1, size, color.value),
    [handleAddToCart]
  );

  const handleUpdateApparelHero = useCallback((url: string) => handleUpdateHeroImage("apparel", url), []);
  const handleUpdateBagsHero = useCallback((url: string) => handleUpdateHeroImage("bagsAccessories", url), []);
  const handleUpdateFragrancesHero = useCallback((url: string) => handleUpdateHeroImage("fragrances", url), []);

  const handleCreateProductSubmit = async (values: ProductDraftValues) => {
    if (!isAdmin) {
      setAdminGuardAction("add");
      setShowAdminGuardModal(true);
      return;
    }

    const newProduct = buildProductFromDraft(values);

    try {
      const { createProduct } = await import("./services/productService");
      await createProduct(newProduct);
      setProductsList((prev) => [newProduct, ...prev]);
      (window as any).hasPublishedProduct = true;
      setIsCreatingProduct(false);
      window.history.replaceState({ activeTab, selectedProductId: null, isCreatingProduct: false, editingProductId: null }, "");
    } catch (err: any) {
      console.error("Failed to create product in Firestore:", err?.message || String(err));
      alert("Failed to save product to database. Please try again.");
    }
  };

  const handleEditProductSubmit = async (values: ProductDraftValues) => {
    if (!isAdmin) {
      setAdminGuardAction("edit");
      setShowAdminGuardModal(true);
      return;
    }
    if (!editingProduct) return;

    const updatedProduct = buildProductFromDraft(values, editingProduct);

    try {
      const { updateProduct } = await import("./services/productService");
      await updateProduct(updatedProduct);
      setProductsList((prev) => prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p)));
      if (selectedProduct && selectedProduct.id === editingProduct.id) setSelectedProduct(updatedProduct);
      (window as any).hasPublishedProduct = true;
      setEditingProduct(null);
      window.history.replaceState({ activeTab, selectedProductId: updatedProduct.id, isCreatingProduct: false, editingProductId: null }, "");
    } catch (err: any) {
      console.error("Failed to update product in Firestore:", err?.message || String(err));
      alert("Failed to save product modifications. Please try again.");
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    if (!isAdmin) {
      setAdminGuardAction("edit");
      setShowAdminGuardModal(true);
      return;
    }

    try {
      const { updateProduct } = await import("./services/productService");
      await updateProduct(updatedProduct);
      setProductsList((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      if (selectedProduct && selectedProduct.id === updatedProduct.id) setSelectedProduct(updatedProduct);
    } catch (err: any) {
      console.error("Failed to update product:", err?.message || String(err));
      throw new Error(err?.message || String(err));
    }
  };

  return (
    <div
      className={
        resolvedAppearance === "light"
          ? "bg-[#f6efe2] min-h-screen text-chocolate flex flex-col relative"
          : "bg-chocolate min-h-screen text-cream flex flex-col relative"
      }
      id="app-root-container"
    >
      <AnimatePresence mode="wait">
        {isCartPage ? (
          <CartPage isOpen={true} onClose={() => transitionTo("home", null, false, null)} cartItems={cart} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onClearCart={handleClearCart} priceCurrency={priceCurrency} user={user} />
        ) : isCreatingProduct ? (
          <React.Suspense fallback={<Skeleton type="home" />}>
            <AddProduct key="add-product-screen" onCancel={handleGoBack} onSubmit={handleCreateProductSubmit} />
          </React.Suspense>
        ) : editingProduct ? (
          <React.Suspense fallback={<Skeleton type="home" />}>
            <EditProduct key="edit-product-screen" product={editingProduct} onCancel={handleGoBack} onSubmit={handleEditProductSubmit} />
          </React.Suspense>
        ) : selectedProduct ? (
          <React.Suspense fallback={<Skeleton type="detail" />}>
            <ProductDetailPage
              key="product-detail-screen"
              product={selectedProduct}
              onBack={handleGoBack}
              onAddToCart={handleAddToCart}
              priceCurrency={priceCurrency}
              onEditProduct={(prod) => {
                if (!isAdmin) {
                  setAdminGuardAction("edit");
                  setShowAdminGuardModal(true);
                } else {
                  transitionTo(activeTab, null, false, prod);
                }
              }}
              isAdmin={isAdmin}
              onUpdateProduct={handleUpdateProduct}
              onTriggerAdminGuard={(action) => {
                setAdminGuardAction(action);
                setShowAdminGuardModal(true);
              }}
            />
          </React.Suspense>
        ) : (
          <CatalogView
            activeTab={activeTab}
            setActiveTab={(tab) => transitionTo(tab, null, false, null)}
            productsList={productsList}
            isLoadingProducts={isLoadingProducts}
            productsError={productsError}
            selectedProduct={selectedProduct}
            wishlist={wishlist}
            priceCurrency={priceCurrency}
            heroImages={heroImages}
            user={user}
            isAdmin={isAdmin}
            authInitialIsSignUp={authInitialIsSignUp}
            onHome={() => {
              transitionTo("home", null, false, null);
              handleNavigation("home");
            }}
            onNavigate={handleNavigation}
            onCreateProduct={() => {
              if (!isAdmin) {
                setAdminGuardAction("add");
                setShowAdminGuardModal(true);
              } else {
                transitionTo(activeTab, null, true, null);
              }
            }}
            onSignOut={handleSignOut}
            onAuthAction={setAuthInitialIsSignUp}
            onViewDetails={handleViewDetails}
            onAddToCartFromShop={handleAddToCartFromShop}
            onAddToCartFromPages={handleAddToCartFromPages}
            onToggleWishlist={handleToggleWishlist}
            onGoBack={handleGoBack}
            onUpdateHomeHero={handleUpdateHomeHero}
            onUpdateApparelHero={handleUpdateApparelHero}
            onUpdateBagsHero={handleUpdateBagsHero}
            onUpdateFragrancesHero={handleUpdateFragrancesHero}
            onExploreShopFromAuth={() => transitionTo("shop", null, false, null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdminGuardModal && adminGuardAction && (
          <AdminGuardModal actionType={adminGuardAction} onClose={() => { setShowAdminGuardModal(false); setAdminGuardAction(null); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
