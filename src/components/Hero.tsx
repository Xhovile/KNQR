import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onShopClick: () => void;
}

export default function Hero({ onShopClick }: HeroProps) {
  const [heroImage, setHeroImage] = useState<string>(
    () => localStorage.getItem("knqr_custom_hero_image") || "/src/assets/images/knqr_black_shirt_1782625829276.jpg"
  );
  const [showEditButton, setShowEditButton] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startLongPress = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      setShowEditButton(true);
    }, 600); // 600ms long press threshold
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, []);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setShowConfirmDialog(true);
        setShowEditButton(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmSave = () => {
    if (tempImage) {
      setHeroImage(tempImage);
      localStorage.setItem("knqr_custom_hero_image", tempImage);
    }
    setTempImage(null);
    setShowConfirmDialog(false);
  };

  const handleCancelConfirm = () => {
    setTempImage(null);
    setShowConfirmDialog(false);
  };

  return (
    <section 
      className="relative min-h-[55vh] flex flex-col justify-center items-center px-6 py-6 overflow-hidden border-b-4 border-chocolate bg-white"
      id="knqr-hero-section"
    >
      {/* Decorative Elegant Abstract Lines Behind the Image */}
      <div className="absolute inset-0 pointer-events-none opacity-40 select-none z-0">
        <svg className="w-full h-full" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Abstract curve lines reflecting fashion patterns */}
          <path 
            d="M-50 150C80 180 120 300 280 220C440 140 420 380 500 420" 
            stroke="#d4af37" 
            strokeWidth="0.75" 
            strokeDasharray="4 4" 
          />
          <path 
            d="M350 50C250 180 180 80 50 250C-80 420 150 500 100 650" 
            stroke="#d4af37" 
            strokeWidth="1" 
            className="opacity-75"
          />
          <circle cx="280" cy="220" r="4" fill="#d4af37" />
          <circle cx="50" cy="250" r="3" fill="#d4af37" className="opacity-50" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Large Portrait Lifestyle Image with Rounded Corners */}
        <motion.div 
          className="relative w-full aspect-[3/2] mb-5 rounded-2xl overflow-hidden luxury-border luxury-glow group bg-chocolate-light cursor-pointer select-none"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          id="hero-image-container"
          onMouseDown={startLongPress}
          onMouseUp={cancelLongPress}
          onMouseLeave={cancelLongPress}
          onTouchStart={startLongPress}
          onTouchEnd={cancelLongPress}
        >
          {/* Subtle background color block for image loading */}
          <img
            src={heroImage}
            alt="KNQR Premium Lifestyle Campaign Model"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
            referrerPolicy="no-referrer"
            loading="eager"
            id="hero-lifestyle-img"
          />
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="hero-image-uploader"
          />

          {/* Edit button pop-up overlay */}
          {showEditButton && (
            <div className="absolute inset-0 bg-chocolate/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20 space-y-3">
              <span className="p-2 bg-gold/10 text-gold rounded-full">
                <ImageIcon className="w-5 h-5" />
              </span>
              <p className="text-xs font-mono text-gold tracking-widest uppercase">Admin Controls</p>
              <button
                onClick={handleEditClick}
                className="px-5 py-2.5 bg-cream hover:bg-gold text-chocolate font-bold rounded-xl text-xs font-mono tracking-widest uppercase transition-all cursor-pointer shadow-md"
                id="hero-edit-image-btn"
              >
                Change Hero Image
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditButton(false);
                }}
                className="text-xs font-mono text-cream/70 hover:text-cream underline uppercase tracking-widest cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Luxury dark gradient overlay to give a premium feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-chocolate via-chocolate/5 to-transparent opacity-45 pointer-events-none" />
          
          {/* Ambient Corner Accents */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-gold/40 rounded-tl-sm" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-gold/40 rounded-tr-sm" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-gold/40 rounded-bl-sm" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-gold/40 rounded-br-sm" />
        </motion.div>

        {/* Confirmation Modal Overlay */}
        {showConfirmDialog && tempImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-chocolate-dark/95 backdrop-blur-md p-6">
            <div className="max-w-md w-full bg-chocolate border border-cream/15 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden text-cream space-y-6">
              <h3 className="font-serif text-xl tracking-wide text-cream">
                Confirm New Hero Image?
              </h3>
              <p className="text-[10px] font-mono text-gold tracking-widest uppercase">
                Preview of selected image
              </p>
              
              <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden border border-cream/15 bg-chocolate-light/50 shadow-inner">
                <img
                  src={tempImage}
                  alt="New Hero Preview"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCancelConfirm}
                  className="flex-1 py-3 border border-cream/15 hover:border-cream/35 rounded-xl text-xs font-mono tracking-wider uppercase text-cream/70 hover:text-cream transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  className="flex-1 py-3 bg-cream hover:bg-gold text-chocolate font-bold rounded-xl text-xs font-mono tracking-wider uppercase transition-all cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Text Area */}
        <div className="text-center max-w-md px-2 relative mt-4" id="hero-text-content">
          {/* Elegant top-left accent bracket representing luxury layout */}
          <div className="absolute -left-2 -top-6 w-12 h-12 border-l border-t border-chocolate/20 pointer-events-none" />

          {/* Serif Headings */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <h2 className="font-serif text-5xl sm:text-6xl font-normal tracking-tight text-chocolate mb-5 leading-tight select-none">
              Choose your
              <span className="block italic text-gold font-light mt-2 font-serif">best outfit</span>
            </h2>
          </motion.div>

          {/* Large Outlined Shop Now Button from Elegant Dark design with Dark Royal background */}
          <motion.button
            onClick={onShopClick}
            className="group px-10 py-4 border border-[#0b1b33] bg-[#0b1b33] hover:bg-[#122c54] text-cream hover:text-gold hover:border-gold font-sans text-[10px] tracking-[0.4em] uppercase transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 mx-auto cursor-pointer rounded-sm"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            id="hero-shop-now-btn"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
