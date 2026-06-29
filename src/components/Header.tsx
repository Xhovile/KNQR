import React, { useState } from "react";
import { motion } from "motion/react";

interface HeaderProps {
  onClick?: () => void;
}

export default function Header({ onClick }: HeaderProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (onClick) {
      setIsClicked(true);
      onClick();
      setTimeout(() => {
        setIsClicked(false);
      }, 500);
    }
  };

  return (
    <header className="pt-16 pb-12 text-center border-b border-cream/5 bg-chocolate-dark">
      <div className="flex flex-col items-center">
        {/* Brand Name */}
        <motion.h1 
          onClick={handleClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className={`font-preospe text-5xl sm:text-6xl md:text-7xl font-bold tracking-[0.25em] uppercase leading-none select-none transition-all duration-300 flex items-baseline justify-center pl-[0.25em] cursor-pointer ${
            isClicked ? "text-gold scale-95 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "text-cream hover:text-gold"
          }`}
          id="knqr-brand-name"
        >
          <span>KNQR</span>
          <span className="text-[10px] sm:text-xs md:text-sm tracking-normal lowercase text-gold font-mono font-normal -ml-[0.25em] self-baseline relative -top-[0.05em]">.mw</span>
        </motion.h1>

        {/* Small Slogan with increased vertical padding and bolder styling */}
        <motion.p 
          animate={isClicked ? { scale: [1, 0.95, 1], opacity: [1, 0.6, 1] } : {}}
          transition={{ duration: 0.4 }}
          className="text-xs sm:text-sm tracking-[0.38em] uppercase text-gold mt-8 font-mono font-extrabold"
          id="knqr-brand-slogan"
        >
          OVERCOME AND TAKE CONTROL
        </motion.p>
      </div>
    </header>
  );
}

