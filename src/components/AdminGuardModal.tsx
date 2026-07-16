import React from "react";
import { ShieldAlert } from "lucide-react";

interface AdminGuardModalProps {
  open: boolean;
  actionType?: "add" | "edit" | "hero" | "restock" | "record_sale" | null;
  onClose: () => void;
}

function getGuardCopy(actionType?: AdminGuardModalProps["actionType"]) {
  switch (actionType) {
    case "add":
      return {
        title: "Admins Only",
        message: "You cannot add products here. This section is reserved for admin accounts only.",
      };
    case "edit":
      return {
        title: "Admin Access Required",
        message: "You cannot edit products here. This section is reserved for admin accounts only.",
      };
    case "hero":
      return {
        title: "Admin Access Required",
        message: "You cannot change store visuals here. This section is reserved for admin accounts only.",
      };
    case "restock":
      return {
        title: "Admin Access Required",
        message: "You cannot update stock here. This section is reserved for admin accounts only.",
      };
    case "record_sale":
      return {
        title: "Admin Access Required",
        message: "You cannot record sales here. This section is reserved for admin accounts only.",
      };
    default:
      return {
        title: "Admin Access Required",
        message: "This action is reserved for the administrator account.",
      };
  }
}

export default function AdminGuardModal({ open, actionType, onClose }: AdminGuardModalProps) {
  if (!open) return null;

  const copy = getGuardCopy(actionType);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-chocolate/10 bg-light-brown p-6 text-chocolate shadow-2xl">
        <div className="mb-4 flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
          <div>
            <h3 className="mb-1 font-serif text-xl">{copy.title}</h3>
            <p className="text-sm leading-relaxed text-chocolate/75">{copy.message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-xl border border-chocolate/15 px-4 py-2 text-sm font-mono hover:bg-chocolate/5"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
