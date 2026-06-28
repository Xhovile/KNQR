import React from "react";
import { Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitText?: string;
}

export default function FormActions({
  onCancel,
  onSubmit,
  isSubmitting = false,
  submitText = "Publish",
}: FormActionsProps) {
  return (
    <div className="sticky bottom-0 z-40 bg-chocolate-dark border-t border-cream/10 backdrop-blur-md py-4 px-6 md:px-12 flex items-center justify-between shadow-2xl">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-6 py-3 border border-cream/15 hover:border-cream/40 rounded-xl text-xs font-mono tracking-widest uppercase text-cream/70 hover:text-cream transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
        id="product-form-cancel-btn"
      >
        Cancel
      </button>

      <motion.button
        onClick={onSubmit}
        disabled={isSubmitting}
        whileTap={{ scale: 0.95, y: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="px-8 py-3 bg-cream hover:bg-gold text-chocolate rounded-xl text-xs font-mono tracking-widest uppercase font-bold transition-all shadow-xl cursor-pointer flex items-center space-x-2 disabled:bg-cream/40 disabled:cursor-not-allowed select-none"
        id="product-form-publish-btn"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-chocolate" />
            <span>Syncing...</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4 text-chocolate" />
            <span>{submitText}</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
