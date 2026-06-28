import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  value,
  options = [],
  onChange,
  placeholder = "Select an option",
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Selection Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-chocolate border rounded-xl px-4 py-3.5 text-sm text-cream text-left flex items-center justify-between transition-all cursor-pointer focus:outline-none select-none ${
          isOpen ? "border-gold ring-1 ring-gold/20" : "border-cream/15 hover:border-cream/35"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className={value ? "text-cream" : "text-cream/30"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-cream/50 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-gold" : ""
          }`}
        />
      </button>

      {/* Dropdown Options List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-chocolate border border-cream/15 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto scrollbar-thin"
          >
            <div className="py-1">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-xs text-cream/40 font-mono uppercase">
                  No options available
                </div>
              ) : (
                options.map((option) => {
                  const isSelected = value === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors cursor-pointer select-none ${
                        isSelected
                          ? "bg-cream text-chocolate font-medium"
                          : "text-cream/80 hover:bg-white/5 hover:text-cream"
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
