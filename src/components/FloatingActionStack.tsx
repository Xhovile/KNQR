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
        className="flex h-14 w-14 items-center justify-center rounded-full border border-chocolate/15 bg-chocolate text-cream shadow-2xl transition hover:bg-gold hover:text-chocolate"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onOpenCart}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 bg-gold text-chocolate shadow-2xl transition hover:bg-cream"
        aria-label="Open cart"
      >
        <ShoppingCart className="h-5 w-5" />
      </button>
    </div>
  );
}
