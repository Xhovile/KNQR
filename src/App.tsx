import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  ShoppingCart, 
  ArrowUp,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
const Collection = React.lazy(() => import("./components/Collection"));
const Promo = React.lazy(() => import("./components/Promo"));
import Footer from "./components/Footer";
import Cart from "./components/Cart";

const ProductDetailPage = React.lazy(() => import("./ProductDetailPage"));
const AddProduct = React.lazy(() => import("./AddProduct"));
const EditProduct = React.lazy(() => import("./EditProduct"));
const Shop = React.lazy(() => import("./Shop"));
const ApparelPage = React.lazy(() => import("./ApparelPage"));
const BagsAndAccessoriesPage = React.lazy(() => import("./BagsAndAccessoriesPage"));
const FragrancesPage = React.lazy(() => import("./FragrancesPage"));
const ContactPage = React.lazy(() => import("./ContactPage"));

import Skeleton from "./components/Skeleton";
import { ProductDraftValues } from "./productSchema";
import { auth } from "./lib/firebase";
import AuthForm from "./components/AuthForm";
import OrderHistory from "./components/OrderHistory";

import { PRODUCTS } from "./data";
import { Product, CartItem, ActiveTab } from "./types";
import { 
  fetchProducts, 
  createProduct, 
  updateProduct,
  fetchHeroImages,
  updateHeroImageInDb,
  DEFAULT_HEROES,
  HeroImages
} from "./services/productService";

export default function App() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceCurrency] = useState<"USD" | "MWK">("MWK");
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImages>(DEFAULT_HEROES);
  const [user, setUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [showAdminGuardModal, setShowAdminGuardModal] = useState(false);
  const [adminGuardAction, setAdminGuardAction] = useState<"add" | "edit" | "hero" | "restock" | "record_sale" | null>(null);
  const [authInitialIsSignUp, setAuthInitialIsSignUp] = useState(false);

  const isAdmin = user && user.email === "xhovilepublications@gmail.com";

  // Subscribe to Authentication State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      transitionTo("home");
    } catch (err: any) {
      console.error("Failed to sign out:", err?.message || String(err));
    }
  };

  // Load products and hero images from Firestore on boot
  useEffect(() => {
    async function initApp() {
      setIsLoadingProducts(true);

      try {
        const [productsResult, heroesResult] = await Promise.allSettled([
          fetchProducts(),
          fetchHeroImages()
        ]);

        if (productsResult.status === "fulfilled") {
          setProductsList(productsResult.value);
        } else {
          console.error("Firestore products load failed:", productsResult.reason);
          setProductsList([]);
        }

        if (heroesResult.status === "fulfilled") {
          setHeroImages(heroesResult.value);
        } else {
          console.error("Firestore hero images load failed:", heroesResult.reason);
        }
      } finally {
        setIsLoadingProducts(false);
      }
    }

    initApp();
  }, []);

  const handleUpdateHeroImage = async (page: keyof HeroImages, url: string) => {
    try {
      await updateHeroImageInDb(page, url);
      setHeroImages((prev) => ({
        ...prev,
        [page]: url
      }));
    } catch (err: any) {
      console.error(`Failed to update hero image for page ${page}:`, err?.message || String(err));
      alert("Failed to save customizable hero image. Please try again.");
      throw new Error(err?.message || String(err));
    }
  };

  const transitionTo = (
    tab: ActiveTab,
    product: Product | null = null,
    isCreating = false,
    editing: Product | null = null,
    skipPush = false
  ) => {
    // If we are explicitly opening the editor, reset the published flag so they can use it
    if (isCreating || editing) {
      (window as any).hasPublishedProduct = false;
    }

    // Guard: If they have published, bypass any back-navigation attempt to restore the editor state
    let finalIsCreating = isCreating;
    let finalEditing = editing;
    if ((window as any).hasPublishedProduct && (isCreating || editing)) {
      finalIsCreating = false;
      finalEditing = null;
    }

    setActiveTab(tab);
    setSelectedProduct(product);
    setIsCreatingProduct(finalIsCreating);
    setEditingProduct(finalEditing);

    // Scroll to top of the page on transition instantly
    window.scrollTo(0, 0);

    if (!skipPush) {
      const stateObj = {
        activeTab: tab,
        selectedProductId: product ? product.id : null,
        isCreatingProduct: finalIsCreating,
        editingProductId: finalEditing ? finalEditing.id : null,
      };
      window.history.pushState(stateObj, "");
    }
  };

  const handleGoBack = () => {
    if (window.history.state && window.history.length > 1) {
      window.history.back();
    } else {
      transitionTo("home", null, false, null);
    }
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state) {
        const foundProduct = PRODUCTS.find((p) => p.id === state.selectedProductId) || null;
        const actualProduct = productsList.find((p) => p.id === state.selectedProductId) || foundProduct;
        
        const foundEditing = PRODUCTS.find((p) => p.id === state.editingProductId) || null;
        const actualEditing = productsList.find((p) => p.id === state.editingProductId) || foundEditing;

        const shouldSkipEditor = (window as any).hasPublishedProduct;
        const isCreatingParam = shouldSkipEditor ? false : !!state.isCreatingProduct;
        const editingParam = shouldSkipEditor ? null : actualEditing;

        transitionTo(
          state.activeTab || "home",
          actualProduct,
          isCreatingParam,
          editingParam,
          true
        );
      } else {
        transitionTo("home", null, false, null, true);
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Initial state setup
    if (!window.history.state) {
      const initialState = {
        activeTab: "home",
        selectedProductId: null,
        isCreatingProduct: false,
        editingProductId: null,
      };
      window.history.replaceState(initialState, "");
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [productsList]);


  const activeTabRef = useRef(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const handleToggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const handleViewDetails = useCallback((product: Product) => {
    transitionTo(activeTabRef.current, product, false, null);
  }, []);

  // Monitor scroll for "back to top" button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAddToCart = useCallback((product: Product, quantity = 1, size?: string, color?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
    });
  }, []);

  const handleAddToCartFromShop = useCallback((product: Product, size: string, color: { name: string; value: string }) => {
    handleAddToCart(product, 1, size, color.name);
  }, [handleAddToCart]);

  const handleAddToCartFromPages = useCallback((product: Product, size: string, color: { name: string; value: string }) => {
    handleAddToCart(product, 1, size, color.value);
  }, [handleAddToCart]);

  const handleUpdateApparelHero = useCallback((url: string) => {
    return handleUpdateHeroImage("apparel", url);
  }, [handleUpdateHeroImage]);

  const handleUpdateBagsHero = useCallback((url: string) => {
    return handleUpdateHeroImage("bagsAccessories", url);
  }, [handleUpdateHeroImage]);

  const handleUpdateFragrancesHero = useCallback((url: string) => {
    return handleUpdateHeroImage("fragrances", url);
  }, [handleUpdateHeroImage]);

  const handleUpdateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleNavigation = (tab: ActiveTab) => {
    if (tab === "home") {
      window.scrollTo(0, 0);
    } else if (tab === "shop") {
      window.scrollTo(0, 0);
    } else if (tab === "contact") {
      window.scrollTo(0, 0);
    }
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
    setActiveTab("home");
  };

  const handleCreateProductSubmit = async (values: ProductDraftValues) => {
    if (!isAdmin) {
      setAdminGuardAction("add");
      setShowAdminGuardModal(true);
      return;
    }
    const newId = `knqr-${values.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: values.name,
      priceUSD: values.priceUSD || 0,
      priceMWK: values.priceMWK || 0,
      image: values.image || "",
      images: values.images || [],
      category: values.category || "T-shirts",
      collectionCategory: values.collectionCategory,
      description: values.description,
      sizes: values.sizes,
      colors: values.colors,
      details: values.details,
      status: values.status,
      stock: values.stock || 0,
      delivery: {
        available: values.deliveryMethod !== "Pickup",
        methods: [values.deliveryMethod].filter(Boolean) as string[],
        note: values.deliveryNote
      },
      fit: values.fit,
      material: values.material,
      apparelGender: values.apparelGender,
      sleeveType: values.sleeveType,
      bagType: values.bagType,
      bagMaterial: values.bagMaterial,
      strapType: values.strapType,
      bagCapacity: values.bagCapacity,
      useCase: values.useCase,
      volume: values.volume,
      scentFamily: values.scentFamily,
      fragranceGender: values.fragranceGender,
      concentration: values.concentration,
      longevity: values.longevity,
      notes: values.notes,
    };

    try {
      await createProduct(newProduct);
      setProductsList((prev) => [newProduct, ...prev]);
      // Set the published flag to prevent back-navigation to this editor state
      (window as any).hasPublishedProduct = true;
      setIsCreatingProduct(false);

      // Replace the current history state with the collection tab view
      const stateObj = {
        activeTab: activeTab,
        selectedProductId: null,
        isCreatingProduct: false,
        editingProductId: null,
      };
      window.history.replaceState(stateObj, "");
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

    const updatedProduct: Product = {
      ...editingProduct,
      name: values.name,
      priceUSD: values.priceUSD || 0,
      priceMWK: values.priceMWK || 0,
      image: values.image || "",
      images: values.images || [],
      category: values.category || "T-shirts",
      collectionCategory: values.collectionCategory,
      description: values.description,
      sizes: values.sizes,
      colors: values.colors,
      details: values.details,
      status: values.status,
      stock: values.stock || 0,
      delivery: {
        available: values.deliveryMethod !== "Pickup",
        methods: [values.deliveryMethod].filter(Boolean) as string[],
        note: values.deliveryNote
      },
      fit: values.fit,
      material: values.material,
      apparelGender: values.apparelGender,
      sleeveType: values.sleeveType,
      bagType: values.bagType,
      bagMaterial: values.bagMaterial,
      strapType: values.strapType,
      bagCapacity: values.bagCapacity,
      useCase: values.useCase,
      volume: values.volume,
      scentFamily: values.scentFamily,
      fragranceGender: values.fragranceGender,
      concentration: values.concentration,
      longevity: values.longevity,
      notes: values.notes,
    };

    try {
      await updateProduct(updatedProduct);
      setProductsList((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
      );
      
      if (selectedProduct && selectedProduct.id === editingProduct.id) {
        setSelectedProduct(updatedProduct);
      }

      // Set the published flag to prevent back-navigation to this editor state
      (window as any).hasPublishedProduct = true;
      setEditingProduct(null);

      // Replace the current history state with the detail view of the updated product
      const stateObj = {
        activeTab: activeTab,
        selectedProductId: updatedProduct.id,
        isCreatingProduct: false,
        editingProductId: null,
      };
      window.history.replaceState(stateObj, "");
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
      await updateProduct(updatedProduct);
      setProductsList((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      if (selectedProduct && selectedProduct.id === updatedProduct.id) {
        setSelectedProduct(updatedProduct);
      }
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
            <AddProduct
              key="add-product-screen"
              onCancel={handleGoBack}
              onSubmit={handleCreateProductSubmit}
            />
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
          <motion.div
            key="main-catalog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col min-h-screen"
          >
            {/* 1. Header Area */}
            <Header onClick={() => {
              transitionTo("home", null, false, null);
              handleNavigation("home");
            }} />

            {/* 2. Horizontal Navigation */}
            <Navigation 
              activeTab={activeTab} 
              setActiveTab={(tab) => transitionTo(tab, null, false, null)} 
              onNavigate={handleNavigation} 
              onCreateProduct={() => {
                if (!isAdmin) {
                  setAdminGuardAction("add");
                  setShowAdminGuardModal(true);
                } else {
                  transitionTo(activeTab, null, true, null);
                }
              }}
              user={user}
              onSignOut={handleSignOut}
              onAuthAction={(isSignUp) => setAuthInitialIsSignUp(isSignUp)}
            />

            <AnimatePresence mode="wait">
              {isLoadingProducts ? (
                <motion.div
                  key="loading-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-grow bg-light-brown"
                >
                  <Skeleton type={activeTab === "home" ? "home" : selectedProduct ? "detail" : "grid"} />
                </motion.div>
              ) : activeTab === "shop" ? (
                <motion.div
                  key="shop-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-grow bg-light-brown text-chocolate border-b border-chocolate/5"
                >
                  <React.Suspense fallback={<Skeleton type="grid" />}>
                    <Shop
                      products={productsList}
                      onViewDetails={handleViewDetails}
                      onAddToCart={handleAddToCartFromShop}
                      onToggleWishlist={handleToggleWishlist}
                      wishlist={wishlist}
                      priceCurrency={priceCurrency}
                    />
                  </React.Suspense>
                </motion.div>
              ) : activeTab === "apparel" ? (
                <motion.div
                  key="apparel-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-grow bg-light-brown text-chocolate border-b border-chocolate/5"
                >
                  <React.Suspense fallback={<Skeleton type="grid" />}>
                    <ApparelPage
                      products={productsList}
                      onViewDetails={handleViewDetails}
                      onAddToCart={handleAddToCartFromPages}
                      onToggleWishlist={handleToggleWishlist}
                      wishlist={wishlist}
                      priceCurrency={priceCurrency}
                      onBackToHome={handleGoBack}
                      heroImage={heroImages.apparel}
                      onUpdateHeroImage={handleUpdateApparelHero}
                      isAdmin={isAdmin}
                    />
                  </React.Suspense>
                </motion.div>
              ) : activeTab === "bags-accessories" ? (
                <motion.div
                  key="bags-accessories-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-grow bg-light-brown text-chocolate border-b border-chocolate/5"
                >
                  <React.Suspense fallback={<Skeleton type="grid" />}>
                    <BagsAndAccessoriesPage
                      products={productsList}
                      onViewDetails={handleViewDetails}
                      onAddToCart={handleAddToCartFromPages}
                      onToggleWishlist={handleToggleWishlist}
                      wishlist={wishlist}
                      priceCurrency={priceCurrency}
                      onBackToHome={handleGoBack}
                      heroImage={heroImages.bagsAccessories}
                      onUpdateHeroImage={handleUpdateBagsHero}
                      isAdmin={isAdmin}
                    />
                  </React.Suspense>
                </motion.div>
              ) : activeTab === "fragrances" ? (
                <motion.div
                  key="fragrances-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-grow bg-light-brown text-chocolate border-b border-chocolate/5"
                >
                  <React.Suspense fallback={<Skeleton type="grid" />}>
                    <FragrancesPage
                      products={productsList}
                      onViewDetails={handleViewDetails}
                      onAddToCart={handleAddToCartFromPages}
                      onToggleWishlist={handleToggleWishlist}
                      wishlist={wishlist}
                      priceCurrency={priceCurrency}
                      onBackToHome={handleGoBack}
                      heroImage={heroImages.fragrances}
                      onUpdateHeroImage={handleUpdateFragrancesHero}
                      isAdmin={isAdmin}
                    />
                  </React.Suspense>
                </motion.div>
              ) : activeTab === "auth" ? (
                <motion.div
                  key="auth-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex-grow flex flex-col items-center justify-center py-12 px-4 bg-light-brown text-chocolate"
                >
                  {user ? (
                    <div className="max-w-2xl w-full mx-auto space-y-8 my-8 flex flex-col items-center" id="profile-and-orders-container">
                      {/* Profile Card */}
                      <div className="bg-chocolate-dark text-cream p-8 sm:p-12 rounded-2xl shadow-2xl border border-cream/10 w-full luxury-glow" id="knqr-profile-card">
                        <div className="flex flex-col items-center text-center">
                          {user.photoURL ? (
                            <img 
                              src={user.photoURL} 
                              alt={user.displayName || "User Avatar"} 
                              className="w-24 h-24 rounded-full border-2 border-gold mb-6 object-cover shadow-lg"
                              referrerPolicy="no-referrer"
                              id="profile-avatar-img"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full border-2 border-gold bg-chocolate flex items-center justify-center text-gold text-3xl font-serif mb-6 shadow-lg" id="profile-avatar-fallback">
                              {user.displayName ? user.displayName[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : "U")}
                            </div>
                          )}
                          
                          <span className="px-3 py-1 bg-gold/10 text-gold text-[10px] tracking-[0.2em] font-mono uppercase rounded-full mb-3 border border-gold/20" id="profile-badge">
                            Bespoke VIP Patron
                          </span>
                          
                          <h2 className="font-serif text-3xl text-cream mb-1" id="profile-display-name">{user.displayName || "Elite Member"}</h2>
                          <p className="font-mono text-xs text-gold tracking-widest uppercase mb-8" id="profile-id-text">KNQR Club ID: #{user.uid.substring(0, 8).toUpperCase()}</p>
                          
                          <div className="w-full space-y-4 border-t border-cream/5 pt-6 text-left max-w-sm" id="profile-details-table">
                            <div className="flex justify-between items-center text-xs font-mono py-1.5 border-b border-cream/5" id="profile-email-row">
                              <span className="text-cream/40 uppercase tracking-wider">Email Address</span>
                              <span className="text-cream font-medium select-all">{user.email || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-mono py-1.5 border-b border-cream/5" id="profile-status-row">
                              <span className="text-cream/40 uppercase tracking-wider">Status</span>
                              <span className="text-emerald-400 font-medium flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse mr-1" />
                                <span>Active Session</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-sm" id="profile-actions">
                            <button
                              onClick={() => transitionTo("shop")}
                              className="flex-1 px-6 py-3 bg-gold text-chocolate hover:bg-cream hover:text-chocolate font-mono text-xs uppercase tracking-wider rounded-xl transition-all font-bold cursor-pointer text-center shadow-lg hover:scale-[1.02]"
                              id="profile-shop-btn"
                            >
                              Explore Collections
                            </button>
                            <button
                              onClick={handleSignOut}
                              className="flex-1 px-6 py-3 border border-cream/10 hover:border-rose-500/30 hover:bg-rose-500/5 hover:text-rose-400 font-mono text-xs uppercase tracking-wider rounded-xl transition-all text-center cursor-pointer hover:scale-[1.02]"
                              id="profile-signout-btn"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Order History Panel */}
                      <div className="bg-chocolate-dark text-cream p-6 sm:p-8 rounded-2xl shadow-2xl border border-cream/10 w-full luxury-glow" id="knqr-orders-card">
                        <OrderHistory 
                          user={user} 
                          priceCurrency={priceCurrency} 
                          onExploreShop={() => transitionTo("shop")}
                        />
                      </div>
                    </div>
                  ) : (
                    <AuthForm initialIsSignUp={authInitialIsSignUp} onSuccess={(currentUser) => setUser(currentUser)} />
                  )}
                </motion.div>
              ) : activeTab === "contact" ? (
                <motion.div
                  key="contact-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex-grow bg-light-brown text-chocolate"
                >
                  <ContactPage />
                </motion.div>
              ) : (
                <motion.div
                  key="home-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-grow bg-light-brown text-chocolate"
                >
                  <Hero />
                  <React.Suspense fallback={<Skeleton type="grid" />}>
                    <Collection products={productsList} />
                  </React.Suspense>
                  <React.Suspense fallback={<Skeleton type="home" />}>
                    <Promo />
                  </React.Suspense>
                  <Footer />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
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

      {/* Admin Guard Modal */}
      {showAdminGuardModal && (
        <div className="fixed inset-0 bg-black/70 z-[120] flex items-center justify-center p-4">
          <div className="bg-light-brown text-chocolate rounded-2xl shadow-2xl max-w-md w-full p-6 border border-chocolate/10">
            <div className="flex items-start gap-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif text-xl mb-1">Admin Access Required</h3>
                <p className="text-sm text-chocolate/70 leading-relaxed">
                  This action is reserved for the administrator account.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-xl border border-chocolate/15 text-sm font-mono hover:bg-chocolate/5"
                onClick={() => setShowAdminGuardModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
