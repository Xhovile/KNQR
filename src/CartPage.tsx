import React from "react";
import { ShoppingCart } from "lucide-react";
import Cart from "./components/Cart";
import { CartItem } from "./types";

interface CartPageProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  onRemoveItem: (productId: string, size?: string, color?: string) => void;
  onClearCart: () => void;
  priceCurrency: "USD" | "MWK";
  user?: any;
}

export default function CartPage({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  priceCurrency,
  user,
}: CartPageProps) {
  return (
    <div className="min-h-screen bg-chocolate text-cream">
      <div className="sticky top-0 z-40 border-b border-cream/10 bg-chocolate/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-5 w-5 text-gold" />
            <div>
              <h1 className="font-serif text-xl sm:text-2xl">Your Cart</h1>
              <p className="text-xs text-cream/60">Review items and complete checkout</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-cream/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cream transition hover:bg-cream/5"
          >
            Back
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Cart
          isOpen={isOpen}
          onClose={onClose}
          cartItems={cartItems}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onClearCart={onClearCart}
          priceCurrency={priceCurrency}
          user={user}
        />
      </div>
    </div>
  );
}
