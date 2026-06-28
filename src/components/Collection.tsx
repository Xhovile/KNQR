import React from "react";
import { Plus, Eye, ShoppingBag } from "lucide-react";
import { Product } from "../types";
import { motion } from "motion/react";

interface CollectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  priceCurrency: "USD" | "MWK";
}

export default function Collection({
  products,
  onSelectProduct,
  onAddToCart,
  priceCurrency,
}: CollectionProps) {
  return (
    <section 
      className="py-16 px-6 bg-light-brown border-b border-chocolate/5 text-center" 
      id="knqr-collection-section"
    >
      {/* Elegant Header */}
      <div className="mb-12 max-w-sm mx-auto">
        <h3 
          className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-chocolate mb-3 uppercase"
          id="collection-heading"
        >
          Our Collection
        </h3>
        <div className="w-12 h-[1px] bg-chocolate/30 mx-auto" />
      </div>

      {/* Vertical List of Cards with generous white space */}
      <div className="space-y-16 max-w-md mx-auto" id="collection-cards-list">
        {products.map((product, idx) => {
          const displayPrice =
            priceCurrency === "USD"
              ? `$${product.priceUSD}`
              : `MK ${product.priceMWK.toLocaleString()}`;

          return (
            <motion.div
              key={product.id}
              className="group flex flex-col items-center bg-transparent"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              id={`collection-card-${product.id}`}
            >
              {/* Product Card Large Image Wrapper with zoom effect */}
              <div 
                className="relative w-full aspect-[3/4] mb-5 rounded-2xl overflow-hidden border border-chocolate/15 cursor-pointer bg-[#ece5d8]"
                onClick={() => onSelectProduct(product)}
                id={`card-image-click-${product.id}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                  referrerPolicy="no-referrer"
                  id={`card-img-${product.id}`}
                />

                {/* Hover Quick actions overlay */}
                <div className="absolute inset-0 bg-chocolate/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 pointer-events-none group-hover:pointer-events-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="p-3 bg-chocolate hover:bg-gold text-cream hover:text-chocolate rounded-full transition-all duration-200 transform scale-90 group-hover:scale-100 cursor-pointer shadow-lg"
                    title="Quick View"
                    id={`quick-view-btn-${product.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="p-3 bg-chocolate hover:bg-gold text-cream hover:text-chocolate rounded-full transition-all duration-200 transform scale-90 group-hover:scale-100 cursor-pointer shadow-lg"
                    title="Add to Cart"
                    id={`add-to-cart-btn-${product.id}`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Minimal Text with ample white space */}
              <div className="text-center w-full px-2" id={`card-info-${product.id}`}>
                <h4 
                  className="font-serif text-xl font-normal text-chocolate hover:text-chocolate-light transition-colors cursor-pointer tracking-wide"
                  onClick={() => onSelectProduct(product)}
                  id={`card-title-${product.id}`}
                >
                  {product.name}
                </h4>
                
                {/* Visual subtle divider between list items */}
                <div className="w-8 h-[1px] bg-chocolate/10 mx-auto mt-6" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
