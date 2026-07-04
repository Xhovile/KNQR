import React from "react";
import { ArrowRight, LogOut, ShoppingBag, BadgeCheck, Mail, UserCircle2 } from "lucide-react";

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
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-gold">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Bespoke VIP Patron
                </span>
                <div>
                  <h2 className="font-serif text-3xl text-cream leading-tight" id="profile-display-name">
                    {displayName}
                  </h2>
                  <p className="mt-1 text-xs font-mono uppercase tracking-[0.25em] text-gold/75" id="profile-id-text">
                    KNQR Club ID: #{String(user.uid || "").substring(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]" id="profile-summary-chips">
              <div className="rounded-2xl border border-cream/10 bg-white/5 px-4 py-3">
                <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-cream/45">Email</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-cream/90">
                  <Mail className="h-4 w-4 text-gold" />
                  <span className="truncate">{user.email || "N/A"}</span>
                </div>
              </div>
              <div className="rounded-2xl border border-cream/10 bg-white/5 px-4 py-3">
                <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-cream/45">Status</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                  <span>Active Session</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3" id="profile-stat-strip">
            <div className="rounded-2xl border border-cream/10 bg-white/5 px-4 py-4">
              <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-cream/45">Identity</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-cream/90">
                <UserCircle2 className="h-4 w-4 text-gold" />
                <span>{displayName}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-cream/10 bg-white/5 px-4 py-4">
              <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-cream/45">Membership</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-cream/90">
                <BadgeCheck className="h-4 w-4 text-gold" />
                <span>Patron Access</span>
              </div>
            </div>
            <div className="rounded-2xl border border-cream/10 bg-white/5 px-4 py-4">
              <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-cream/45">Session</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Live</span>
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
