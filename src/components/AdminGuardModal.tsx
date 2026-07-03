import React from "react";
import { ShieldAlert } from "lucide-react";

interface AdminGuardModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminGuardModal({ open, onClose }: AdminGuardModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[120] flex items-center justify-center p-4">
      <div className="bg-light-brown text-chocolate rounded-2xl shadow-2xl max-w-md w-full p-6 border border-chocolate/10">
        <div className="flex items-start gap-3 mb-4">
          <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-serif text-xl mb-1">Admin Access Required</h3>
            <p className="text-sm text-chocolate/70 leading-relaxed">
              This action is reserved for the administrator account.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-xl border border-chocolate/15 text-sm font-mono hover:bg-chocolate/5"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
