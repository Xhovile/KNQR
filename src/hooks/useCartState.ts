import { useCallback, useState } from "react";
import { CartItem, Product } from "../types";

export function useCartState() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = useCallback(
    (product: Product, quantity = 1, size?: string, color?: string) => {
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
    },
    []
  );

  const handleUpdateQuantity = (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
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

  const handleClearCart = () => setCart([]);

  return {
    cart,
    setCart,
    isCartOpen,
    setIsCartOpen,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
  };
}
