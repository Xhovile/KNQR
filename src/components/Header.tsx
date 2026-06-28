import React from "react";

export default function Header() {
  return (
    <header className="pt-16 pb-12 text-center border-b border-cream/5 bg-chocolate-dark">
      <div className="flex flex-col items-center">
        {/* Brand Name */}
        <h1 
          className="font-preospe text-5xl sm:text-6xl md:text-7xl font-bold tracking-[0.25em] text-cream uppercase leading-none select-none transition-all duration-300 hover:text-gold"
          id="knqr-brand-name"
        >
          KNQR
        </h1>

        {/* Small Slogan with increased vertical padding and bolder styling */}
        <p 
          className="text-xs sm:text-sm tracking-[0.38em] uppercase text-gold mt-8 font-mono font-extrabold"
          id="knqr-brand-slogan"
        >
          OVERCOME AND TAKE CONTROL
        </p>
      </div>
    </header>
  );
}
