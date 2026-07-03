import React from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ProductSectionHeader from "./ProductSectionHeader";

interface FormAccordionProps {
  sectionKey: string;
  title: string;
  description?: string;
  isOpen: boolean;
  onToggle: () => void;
  hasError?: boolean;
  children: React.ReactNode;
}

export default function FormAccordion({
  sectionKey,
  title,
  description,
  isOpen,
  onToggle,
  hasError,
  children,
}: FormAccordionProps) {
  return (
    <div
      className={`border rounded-2xl transition-all duration-350 ${
        isOpen
          ? "bg-chocolate-dark/95 border-cream/20 shadow-2xl overflow-visible"
          : "bg-chocolate-dark/45 border-cream/10 hover:border-cream/20 overflow-hidden"
      }`}
      id={`accordion-section-${sectionKey}`}
    >
      {/* Header Button Toggle */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-center justify-between cursor-pointer focus:outline-none group select-none"
      >
        <div className="flex-1">
          <ProductSectionHeader
            sectionKey={sectionKey}
            title={title}
            description={description}
          />
        </div>

        <div className="flex items-center space-x-3 ml-4">
          {hasError && (
            <div className="flex items-center space-x-1 text-rose-400 bg-rose-500/10 px-2 py-1 rounded-lg text-[10px] font-mono tracking-wider uppercase font-bold animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Incomplete</span>
            </div>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-cream/50 group-hover:text-gold transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </button>

      {/* Dynamic Content Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
          >
            <div className="px-6 pb-6 pt-2 border-t border-cream/5 space-y-6 overflow-visible">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
