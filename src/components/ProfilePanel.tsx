import React from "react";

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
  return (
    <div className="max-w-2xl w-full mx-auto space-y-8 my-8 flex flex-col items-center" id="profile-and-orders-container">
      <div className="bg-chocolate-dark text-cream p-8 sm:p-12 rounded-2xl shadow-2xl border border-cream/10 w-full luxury-glow" id="knqr-profile-card">
        <div className="flex flex-col items-center text-center">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "User Avatar"}
              className="w-24 h-24 rounded-full border-2 border-gold mb-6 object-cover shadow-lg"
              referrerPolicy="no-referrer"
              id="profile-avatar-img"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full border-2 border-gold bg-chocolate flex items-center justify-center text-gold text-3xl font-serif mb-6 shadow-lg"
              id="profile-avatar-fallback"
            >
              {user.displayName ? user.displayName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : "U"}
            </div>
          )}

          <span className="px-3 py-1 bg-gold/10 text-gold text-[10px] tracking-[0.2em] font-mono uppercase rounded-full mb-3 border border-gold/20" id="profile-badge">
            Bespoke VIP Patron
          </span>

          <h2 className="font-serif text-3xl text-cream mb-1" id="profile-display-name">
            {user.displayName || "Elite Member"}
          </h2>
          <p className="font-mono text-xs text-gold tracking-widest uppercase mb-8" id="profile-id-text">
            KNQR Club ID: #{user.uid.substring(0, 8).toUpperCase()}
          </p>

          <div className="w-full space-y-4 border-t border-cream/5 pt-6 text-left max-w-sm" id="profile-details-table">
            <div className="flex justify-between items-center text-xs font-mono py-1.5 border-b border-cream/5" id="profile-email-row">
              <span className="text-cream/40 uppercase tracking-wider">Email Address</span>
              <span className="text-cream font-medium select-all">{user.email || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono py-1.5 border-b border-cream/5" id="profile-status-row">
              <span className="text-cream/40 uppercase tracking-wider">Status</span>
              <span className="text-emerald-400 font-medium flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse mr-1" />
                <span>Active Session</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-sm" id="profile-actions">
            <button
              onClick={onExploreShop}
              className="flex-1 px-6 py-3 bg-gold text-chocolate hover:bg-cream hover:text-chocolate font-mono text-xs uppercase tracking-wider rounded-xl transition-all font-bold cursor-pointer"
              id="profile-shop-btn"
            >
              Explore Collections
            </button>
            <button
              onClick={onSignOut}
              className="flex-1 px-6 py-3 border border-cream/10 hover:border-rose-500/30 hover:bg-rose-500/5 hover:text-rose-400 font-mono text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              id="profile-signout-btn"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
