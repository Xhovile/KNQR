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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5" aria-label="Quick actions">
      <button
        type="button"
        onClick={scrollToTop}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-chocolate/15 bg-chocolate/65 text-cream shadow-lg backdrop-blur-sm transition hover:bg-gold/85 hover:text-chocolate"
        aria-label="Back to top"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={onOpenCart}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-gold/65 text-chocolate shadow-lg backdrop-blur-sm transition hover:bg-cream/95"
        aria-label="Open cart"
      >
        <ShoppingCart className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
