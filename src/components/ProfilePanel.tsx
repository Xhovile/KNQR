import React from "react";
import { ArrowRight, LogOut, ShoppingBag } from "lucide-react";

interface ProfilePanelProps {
  user: any;
  onExploreShop: () => void;
  onSignOut: () => void;
  priceCurrency: "USD" | "MWK";
}

export default function ProfilePanel({
  user,
  onExploreShop,
  onSignOut,
}: ProfilePanelProps) {
  const displayName = user.displayName || "Elite Member";
  const initial = (displayName[0] || user.email?.[0] || "U").toUpperCase();

  return (
    <div className="max-w-3xl w-full mx-auto my-8" id="profile-and-orders-container">
      <div className="overflow-hidden rounded-[28px] border border-cream/10 bg-chocolate-dark text-cream shadow-2xl luxury-glow" id="knqr-profile-card">
        <div className="h-2 w-full bg-gradient-to-r from-gold/40 via-gold to-gold/40" />

        <div className="p-6 sm:p-8 lg:p-10 space-y-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="h-20 w-20 rounded-full border-2 border-gold object-cover shadow-lg"
                  referrerPolicy="no-referrer"
                  id="profile-avatar-img"
                />
              ) : (
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold bg-chocolate text-2xl font-serif text-gold shadow-lg"
                  id="profile-avatar-fallback"
                >
                  {initial}
                </div>
              )}

              <div className="space-y-2">
                <div>
                  <h2 className="font-serif text-3xl text-cream leading-tight" id="profile-display-name">
                    {displayName}
                  </h2>
                  <p className="mt-1 text-xs font-mono uppercase tracking-[0.25em] text-gold/75" id="profile-id-text">
                    KNQR USER ID: #{String(user.uid || "").substring(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-cream/10 bg-white/5 px-4 py-3 sm:min-w-[260px]" id="profile-summary-email">
              <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-cream/45">Email</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-cream/90">
                <span className="truncate">{user.email || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row" id="profile-actions">
            <button
              onClick={onExploreShop}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.25em] text-chocolate transition hover:bg-cream"
              id="profile-shop-btn"
            >
              <ShoppingBag className="h-4 w-4" />
              Explore Collections
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onSignOut}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-cream/10 px-5 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-cream/75 transition hover:border-rose-400/30 hover:bg-rose-500/5 hover:text-rose-300"
              id="profile-signout-btn"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
