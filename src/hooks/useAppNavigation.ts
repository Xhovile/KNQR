import { useCallback, useEffect, useRef, useState } from "react";
import { PRODUCTS } from "../data";
import { ActiveTab, Product } from "../types";

interface UseAppNavigationArgs {
  productsList: Product[];
}

export function useAppNavigation({ productsList }: UseAppNavigationArgs) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const activeTabRef = useRef(activeTab);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const transitionTo = useCallback(
    (
      tab: ActiveTab,
      product: Product | null = null,
      isCreating = false,
      editing: Product | null = null,
      skipPush = false
    ) => {
      if (isCreating || editing) {
        (window as any).hasPublishedProduct = false;
      }

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

      window.scrollTo(0, 0);

      if (!skipPush) {
        window.history.pushState(
          {
            activeTab: tab,
            selectedProductId: product ? product.id : null,
            isCreatingProduct: finalIsCreating,
            editingProductId: finalEditing ? finalEditing.id : null,
          },
          ""
        );
      }
    },
    []
  );

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;

      if (state) {
        const foundProduct = PRODUCTS.find((p) => p.id === state.selectedProductId) || null;
        const actualProduct = productsList.find((p) => p.id === state.selectedProductId) || foundProduct;

        const foundEditing = PRODUCTS.find((p) => p.id === state.editingProductId) || null;
        const actualEditing = productsList.find((p) => p.id === state.editingProductId) || foundEditing;

        const shouldSkipEditor = (window as any).hasPublishedProduct;

        transitionTo(
          state.activeTab || "home",
          actualProduct,
          shouldSkipEditor ? false : !!state.isCreatingProduct,
          shouldSkipEditor ? null : actualEditing,
          true
        );
      } else {
        transitionTo("home", null, false, null, true);
      }
    };

    window.addEventListener("popstate", handlePopState);

    if (!window.history.state) {
      window.history.replaceState(
        {
          activeTab: "home",
          selectedProductId: null,
          isCreatingProduct: false,
          editingProductId: null,
        },
        ""
      );
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, [productsList, transitionTo]);

  const handleGoBack = useCallback(() => {
    if (window.history.state && window.history.length > 1) {
      window.history.back();
    } else {
      transitionTo("home", null, false, null);
    }
  }, [transitionTo]);

  const handleNavigation = useCallback((tab: ActiveTab) => {
    if (tab === "home" || tab === "shop" || tab === "contact") {
      window.scrollTo(0, 0);
    }
  }, []);

  const openEditor = useCallback(
    (product: Product | null = null, creating = false) => {
      transitionTo(activeTabRef.current, product, creating, creating ? null : product);
    },
    [transitionTo]
  );

  return {
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
    openEditor,
  };
}
