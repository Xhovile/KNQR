import React, { useCallback, useState } from "react";
import { AnimatePresence } from "motion/react";
import { ArrowUp, ShoppingCart, X } from "lucide-react";

import Cart from "./components/Cart";
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

export default function App() {
  const [priceCurrency] = useState<"USD" | "MWK">("MWK");
  const [showAdminGuardModal, setShowAdminGuardModal] = useState(false);
  const [adminGuardAction, setAdminGuardAction] = useState<
    "add" | "edit" | "hero" | "restock" | "record_sale" | null
  >(null);
  const [authInitialIsSignUp, setAuthInitialIsSignUp] = useState(false);

  const {
    user,
    setUser,
    handleSignOut: signOutFromAuth,
  } = useAuthSession();

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
    isCartOpen,
    setIsCartOpen,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
  } = useCartState();

  const {
    activeTab,
    setActiveTab,
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

  const isAdmin = user && user.email === "xhovilepublications@gmail.com";

  const handleSignOut = async () => {
    await signOutFromAuth(() => transitionTo("home"));
  };

  const handleUpdateHeroImage = async (page: keyof HeroImages, url: string) => {
    try {
      await updateHeroImageInDb(page, url);
      setHeroImages((prev) => ({ ...prev, [page]: url }));
    } catch (err: any) {
      console.error(`Failed to update hero image for page ${page}:`, err?.message || String(err));
      alert("Failed to save customizable hero image. Please try again.");
      throw new Error(err?.message || String(err));
    }
  };

  const handleUpdateHomeHero = useCallback((url: string) => handleUpdateHeroImage("home", url), []);

  const handleToggleWishlist = useCallback(() => {
    // kept locally in App for now if you want to move it to a hook in a third pass
  }, []);

  const [wishlist, setWishlist] = useState<string[]>([]);

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
      window.history.replaceState(
        { activeTab, selectedProductId: null, isCreatingProduct: false, editingProductId: null },
        ""
      );
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
      window.history.replaceState(
        { activeTab, selectedProductId: updatedProduct.id, isCreatingProduct: false, editingProductId: null },
        ""
      );
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
    <div className="bg-chocolate min-h-screen text-cream flex flex-col relative" id="app-root-container">
      <AnimatePresence mode="wait">
        {isCreatingProduct ? (
          <React.Suspense fallback={<Skeleton type="home" />}>
            <AddProduct key="add-product-screen" onCancel={handleGoBack} onSubmit={handleCreateProductSubmit} />
          </React.Suspense>
        ) : editingProduct ? (
          <React.Suspense fallback={<Skeleton type="home" />}>
            <EditProduct
              key="edit-product-screen"
              product={editingProduct}
              onCancel={handleGoBack}
              onSubmit={handleEditProductSubmit}
            />
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
            onExploreShopFromAuth={() => transitionTo("shop")}
          />
        )}
      </AnimatePresence>

      <div className="fixed right-5 bottom-5 z-[60] flex flex-col gap-3">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/15 bg-chocolate-dark text-cream shadow-2xl transition hover:-translate-y-0.5 hover:bg-chocolate-light"
          title="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => setIsCartOpen((prev) => !prev)}
          aria-label="Open cart"
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-gold text-chocolate shadow-2xl transition hover:-translate-y-0.5 hover:bg-gold-light"
          title={isCartOpen ? "Close cart" : "Open cart"}
        >
          {isCartOpen ? <X className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
          {cart.length > 0 && !isCartOpen && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-md">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {isCartOpen && (
        <Cart
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          priceCurrency={priceCurrency}
        />
      )}

      <AdminGuardModal open={showAdminGuardModal} onClose={() => setShowAdminGuardModal(false)} />
    </div>
  );
}
