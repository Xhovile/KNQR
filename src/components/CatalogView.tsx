import React from "react";
import { motion, AnimatePresence } from "motion/react";

import Header from "./Header";
import Navigation from "./Navigation";
import Hero from "./Hero";
import Footer from "./Footer";
import Skeleton from "./Skeleton";
import Collection from "./Collection";
import Promo from "./Promo";
import Shop from "../Shop";
import ApparelPage from "../ApparelPage";
import BagsAndAccessoriesPage from "../BagsAndAccessoriesPage";
import FragrancesPage from "../FragrancesPage";
import ContactPage from "../ContactPage";
import AuthForm from "./AuthForm";
import OrderHistory from "./OrderHistory";
import ProfilePanel from "./ProfilePanel";

import { Product, ActiveTab } from "../types";
import { HeroImages } from "../services/productService";

interface CatalogViewProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  productsList: Product[];
  isLoadingProducts: boolean;
  productsError: string | null;
  selectedProduct: Product | null;
  wishlist: string[];
  priceCurrency: "USD" | "MWK";
  heroImages: HeroImages;
  user: any;
  isAdmin: boolean;
  authInitialIsSignUp: boolean;
  onHome: () => void;
  onNavigate: (tab: ActiveTab) => void;
  onCreateProduct: () => void;
  onSignOut: () => void;
  onAuthAction: (isSignUp: boolean) => void;
  onViewDetails: (product: Product) => void;
  onAddToCartFromShop: (product: Product, size: string, color: { name: string; value: string }) => void;
  onAddToCartFromPages: (product: Product, size: string, color: { name: string; value: string }) => void;
  onToggleWishlist: (productId: string) => void;
  onGoBack: () => void;
  onUpdateHomeHero: (url: string) => Promise<void>;
  onUpdateApparelHero: (url: string) => Promise<void>;
  onUpdateBagsHero: (url: string) => Promise<void>;
  onUpdateFragrancesHero: (url: string) => Promise<void>;
  onExploreShopFromAuth: () => void;
}

export default function CatalogView({
  activeTab,
  setActiveTab,
  productsList,
  isLoadingProducts,
  productsError,
  selectedProduct,
  wishlist,
  priceCurrency,
  heroImages,
  user,
  isAdmin,
  authInitialIsSignUp,
  onHome,
  onNavigate,
  onCreateProduct,
  onSignOut,
  onAuthAction,
  onViewDetails,
  onAddToCartFromShop,
  onAddToCartFromPages,
  onToggleWishlist,
  onGoBack,
  onUpdateHomeHero,
  onUpdateApparelHero,
  onUpdateBagsHero,
  onUpdateFragrancesHero,
  onExploreShopFromAuth,
}: CatalogViewProps) {
  const handleSelectCollection = (collectionCategory: string) => {
    const normalized = (collectionCategory || "").toLowerCase();
    if (normalized.includes("apparel")) {
      setActiveTab("apparel");
    } else if (normalized.includes("bag")) {
      setActiveTab("bags-accessories");
    } else if (normalized.includes("frag")) {
      setActiveTab("fragrances");
    } else {
      setActiveTab("shop");
    }
  };

  return (
    <motion.div
      key="main-catalog"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col min-h-screen"
    >
      <Header onClick={onHome} />

      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigate={onNavigate}
        onCreateProduct={onCreateProduct}
        user={user}
        onSignOut={onSignOut}
        onAuthAction={onAuthAction}
      />

      {productsError && !isLoadingProducts ? (
        <div className="mx-4 mt-4 rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-red-900 shadow-sm">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-red-700 mb-2">
            Firestore bootstrap error
          </p>
          <p className="text-sm font-semibold mb-2">The app hit this exact error while loading products:</p>
          <pre className="whitespace-pre-wrap break-words rounded-xl bg-white/80 p-3 text-[11px] leading-relaxed text-red-950 border border-red-100 overflow-auto max-h-56">
            {productsError}
          </pre>
        </div>
      ) : null}

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
          <motion.div key="shop-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="flex flex-col flex-grow bg-light-brown text-chocolate border-b border-chocolate/5">
            <React.Suspense fallback={<Skeleton type="grid" />}>
              <Shop
                products={productsList}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCartFromShop}
                onToggleWishlist={onToggleWishlist}
                wishlist={wishlist}
                priceCurrency={priceCurrency}
              />
            </React.Suspense>
          </motion.div>
        ) : activeTab === "apparel" ? (
          <motion.div key="apparel-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="flex flex-col flex-grow bg-light-brown text-chocolate border-b border-chocolate/5">
            <React.Suspense fallback={<Skeleton type="grid" />}>
              <ApparelPage
                products={productsList}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCartFromPages}
                onToggleWishlist={onToggleWishlist}
                wishlist={wishlist}
                priceCurrency={priceCurrency}
                onBackToHome={onGoBack}
                heroImage={heroImages.apparel}
                onUpdateHeroImage={onUpdateApparelHero}
                isAdmin={isAdmin}
              />
            </React.Suspense>
          </motion.div>
        ) : activeTab === "bags-accessories" ? (
          <motion.div key="bags-accessories-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="flex flex-col flex-grow bg-light-brown text-chocolate border-b border-chocolate/5">
            <React.Suspense fallback={<Skeleton type="grid" />}>
              <BagsAndAccessoriesPage
                products={productsList}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCartFromPages}
                onToggleWishlist={onToggleWishlist}
                wishlist={wishlist}
                priceCurrency={priceCurrency}
                onBackToHome={onGoBack}
                heroImage={heroImages.bagsAccessories}
                onUpdateHeroImage={onUpdateBagsHero}
                isAdmin={isAdmin}
              />
            </React.Suspense>
          </motion.div>
        ) : activeTab === "fragrances" ? (
          <motion.div key="fragrances-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="flex flex-col flex-grow bg-light-brown text-chocolate border-b border-chocolate/5">
            <React.Suspense fallback={<Skeleton type="grid" />}>
              <FragrancesPage
                products={productsList}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCartFromPages}
                onToggleWishlist={onToggleWishlist}
                wishlist={wishlist}
                priceCurrency={priceCurrency}
                onBackToHome={onGoBack}
                heroImage={heroImages.fragrances}
                onUpdateHeroImage={onUpdateFragrancesHero}
                isAdmin={isAdmin}
              />
            </React.Suspense>
          </motion.div>
        ) : activeTab === "auth" ? (
          <motion.div key="auth-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="flex-grow flex flex-col items-center justify-center py-12 px-4 bg-light-brown text-chocolate">
            {user ? (
              <div className="max-w-2xl w-full mx-auto space-y-8 my-8 flex flex-col items-center" id="profile-and-orders-container">
                <ProfilePanel user={user} onExploreShop={onExploreShopFromAuth} onSignOut={onSignOut} priceCurrency={priceCurrency} />
                <div className="bg-chocolate-dark text-cream p-6 sm:p-8 rounded-2xl shadow-2xl border border-cream/10 w-full luxury-glow" id="knqr-orders-card">
                  <OrderHistory user={user} priceCurrency={priceCurrency} onExploreShop={onExploreShopFromAuth} />
                </div>
              </div>
            ) : (
              <AuthForm initialIsSignUp={authInitialIsSignUp} onSuccess={() => {}} />
            )}
          </motion.div>
        ) : activeTab === "contact" ? (
          <motion.div key="contact-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="flex-grow bg-light-brown text-chocolate">
            <ContactPage />
          </motion.div>
        ) : (
          <motion.div key="home-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="flex flex-col flex-grow bg-light-brown text-chocolate">
            <Hero
              onShopClick={() => setActiveTab("shop")}
              heroImage={heroImages.home}
              onUpdateHeroImage={onUpdateHomeHero}
              isAdmin={isAdmin}
            />
            <React.Suspense fallback={<Skeleton type="grid" />}>
              <Collection
                products={productsList}
                onSelectCollection={handleSelectCollection}
                onAddToCart={() => {}}
                priceCurrency={priceCurrency}
              />
            </React.Suspense>
            <React.Suspense fallback={<Skeleton type="home" />}>
              <Promo />
            </React.Suspense>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
