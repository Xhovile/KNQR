import React from "react";
import { motion } from "motion/react";

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
import PrivacySecurityPage from "../PrivacySecurityPage";
import SettingsPage from "../SettingsPage";
import FloatingActionStack from "./FloatingActionStack";
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
  onGoToPrivacy: () => void;
  onOpenCart: () => void;
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
  onGoToPrivacy,
  onOpenCart,
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

  const tabMotionClass = "flex flex-col flex-grow bg-light-brown text-chocolate border-b border-chocolate/5";
  const needsBottomSpacer = !selectedProduct && (activeTab === "shop" || activeTab === "apparel" || activeTab === "bags-accessories" || activeTab === "fragrances");
  const showSharedFooter = activeTab === "shop" || activeTab === "contact";
  const showFloatingActions = activeTab === "shop" || activeTab === "apparel" || activeTab === "bags-accessories" || activeTab === "fragrances";

  const renderHome = () => (
    <motion.div key="home-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.12, ease: "easeOut" }} className="flex flex-col flex-grow bg-light-brown text-chocolate">
      <Hero onShopClick={() => setActiveTab("shop")} heroImage={heroImages.home} onUpdateHeroImage={onUpdateHomeHero} isAdmin={isAdmin} />

      {isLoadingProducts ? (
        <>
          <div className="px-4 sm:px-6 lg:px-8 pt-6"><Skeleton type="grid" /></div>
          <div className="px-4 sm:px-6 lg:px-8 pt-6"><Skeleton type="home" /></div>
        </>
      ) : (
        <>
          <Collection products={productsList} onSelectCollection={handleSelectCollection} onAddToCart={() => {}} priceCurrency={priceCurrency} />
          <Promo />
        </>
      )}

      <Footer />
    </motion.div>
  );

  const renderTab = (node: React.ReactNode, key: string) => (
    <motion.div key={key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.12, ease: "easeOut" }} className={tabMotionClass}>
      {node}
    </motion.div>
  );

  return (
    <motion.div key="main-catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.12, ease: "easeOut" }} className="flex flex-col min-h-screen">
      <Header onClick={onHome} />

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} onNavigate={onNavigate} onCreateProduct={onCreateProduct} user={user} onSignOut={onSignOut} onAuthAction={onAuthAction} />

      {productsError && !isLoadingProducts ? (
        <div className="mx-4 mt-4 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-amber-950 shadow-sm">
          <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-amber-700">Catalog notice</p>
          <p className="text-sm font-medium leading-relaxed">{productsError}</p>
          <p className="mt-2 text-[11px] text-amber-900/70">The page will keep showing the rest of the site while the catalog settles.</p>
        </div>
      ) : null}

      {selectedProduct
        ? renderTab(<React.Suspense fallback={<Skeleton type="detail" />}><></></React.Suspense>, "detail-view")
        : activeTab === "shop"
          ? renderTab(
              isLoadingProducts ? (
                <Skeleton type="grid" />
              ) : (
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
              ),
              "shop-view"
            )
          : activeTab === "apparel"
            ? renderTab(
                isLoadingProducts ? (
                  <Skeleton type="grid" />
                ) : (
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
                ),
                "apparel-view"
              )
            : activeTab === "bags-accessories"
              ? renderTab(
                  isLoadingProducts ? (
                    <Skeleton type="grid" />
                  ) : (
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
                  ),
                  "bags-accessories-view"
                )
              : activeTab === "fragrances"
                ? renderTab(
                    isLoadingProducts ? (
                      <Skeleton type="grid" />
                    ) : (
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
                    ),
                    "fragrances-view"
                  )
                : activeTab === "settings"
                  ? renderTab(
                      <SettingsPage
                        displayName={user?.displayName || user?.email?.split("@")[0] || "KNQR User"}
                        email={user?.email || null}
                        userId={user?.uid || null}
                        onBack={onGoBack}
                        onGoToContact={() => setActiveTab("contact")}
                        onGoToPrivacy={onGoToPrivacy}
                        onSignOut={onSignOut}
                      />,
                      "settings-view"
                    )
                  : activeTab === "privacy-security"
                    ? renderTab(
                        <PrivacySecurityPage
                          onBack={() => setActiveTab("settings")}
                          onGoToContact={() => setActiveTab("contact")}
                        />,
                        "privacy-security-view"
                      )
                    : activeTab === "auth"
                      ? renderTab(
                          user ? (
                            <div className="max-w-2xl w-full mx-auto space-y-8 my-8 flex flex-col items-center" id="profile-and-orders-container">
                              <ProfilePanel user={user} onExploreShop={onExploreShopFromAuth} onSignOut={onSignOut} priceCurrency={priceCurrency} />
                              <div className="bg-chocolate-dark text-cream p-6 sm:p-8 rounded-2xl shadow-2xl border border-cream/10 w-full luxury-glow" id="knqr-orders-card">
                                <OrderHistory user={user} priceCurrency={priceCurrency} onExploreShop={onExploreShopFromAuth} />
                              </div>
                            </div>
                          ) : (
                            <AuthForm initialIsSignUp={authInitialIsSignUp} onSuccess={() => {}} />
                          ),
                          "auth-view"
                        )
                      : activeTab === "contact"
                        ? renderTab(<ContactPage />, "contact-view")
                        : renderHome()}

      {showFloatingActions ? <FloatingActionStack onOpenCart={onOpenCart} /> : null}
      {showSharedFooter ? <Footer /> : null}
      {needsBottomSpacer ? <div className="h-32 lg:h-44" /> : null}
    </motion.div>
  );
}
