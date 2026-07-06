import React from "react";
import { ArrowUp, ShoppingCart } from "lucide-react";

interface FloatingActionStackProps {
  onOpenCart: () => void;
}

export default function FloatingActionStack({ onOpenCart }: FloatingActionStackProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" aria-label="Quick actions">
      <button
        type="button"
        onClick={scrollToTop}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-chocolate/15 bg-chocolate/80 text-cream shadow-xl backdrop-blur-sm transition hover:bg-gold/90 hover:text-chocolate"
        aria-label="Back to top"
      >
        <ArrowUp className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onOpenCart}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/80 text-chocolate shadow-xl backdrop-blur-sm transition hover:bg-cream/95"
        aria-label="Open cart"
      >
        <ShoppingCart className="h-4 w-4" />
      </button>
    </div>
  );
}
