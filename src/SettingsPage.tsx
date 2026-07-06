import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Bell, HelpCircle, Lock, MoonStar, Package, Palette, Save, ShieldCheck, SunMedium, User } from "lucide-react";

export interface ShippingAddressForm {
  fullName: string;
  phone: string;
  city: string;
  addressLine: string;
}

export interface UserSettingsState {
  shippingAddress: ShippingAddressForm;
  appearance: "system" | "light" | "dark";
  notificationsEnabled: boolean;
}

interface SettingsPageProps {
  displayName?: string;
  email?: string | null;
  userId?: string | null;
  onBack: () => void;
  onGoToContact: () => void;
  onSignOut: () => void;
}

const STORAGE_KEY = "knqr.user.settings.v1";
const SETTINGS_UPDATED_EVENT = "knqr:settings-updated";

const DEFAULT_SETTINGS: UserSettingsState = {
  shippingAddress: {
    fullName: "",
    phone: "",
    city: "",
    addressLine: "",
  },
  appearance: "system",
  notificationsEnabled: true,
};

function readSettings(): UserSettingsState {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<UserSettingsState>;
    return {
      shippingAddress: {
        fullName: parsed.shippingAddress?.fullName || "",
        phone: parsed.shippingAddress?.phone || "",
        city: parsed.shippingAddress?.city || "",
        addressLine: parsed.shippingAddress?.addressLine || "",
      },
      appearance: parsed.appearance === "light" || parsed.appearance === "dark" ? parsed.appearance : "system",
      notificationsEnabled: typeof parsed.notificationsEnabled === "boolean" ? parsed.notificationsEnabled : true,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function SettingsPage({ displayName, email, userId, onBack, onGoToContact, onSignOut }: SettingsPageProps) {
  const [settings, setSettings] = useState<UserSettingsState>(() => readSettings());
  const [savedToast, setSavedToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      window.dispatchEvent(new Event(SETTINGS_UPDATED_EVENT));
    } catch {
      // ignore storage errors
    }
  }, [settings]);

  const userLabel = useMemo(() => displayName || "KNQR User", [displayName]);

  const updateShipping = (key: keyof ShippingAddressForm, value: string) => {
    setSettings((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    setSavedToast("Settings saved");
    setTimeout(() => setSavedToast(null), 2000);
  };

  return (
    <div className="min-h-screen bg-light-brown text-chocolate">
      <div className="sticky top-0 z-20 border-b border-chocolate/10 bg-white/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-xs uppercase tracking-widest text-chocolate/70 hover:text-gold">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-gold">Settings</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-chocolate/10 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-start justify-between gap-4 border-b border-chocolate/10 pb-5">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-gold">Account</p>
                  <h1 className="mt-2 font-serif text-3xl text-chocolate">{userLabel}</h1>
                  <p className="mt-2 text-sm text-chocolate/70">Manage the essentials for your KNQR account.</p>
                </div>
                <div className="rounded-2xl border border-chocolate/10 bg-light-brown px-4 py-3 text-right">
                  <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-chocolate/40">KNQR USER ID</p>
                  <p className="mt-1 font-mono text-xs tracking-[0.2em] text-chocolate/80">{userId ? `#${String(userId).slice(0, 8).toUpperCase()}` : "—"}</p>
                  <p className="mt-2 text-[11px] text-chocolate/50">{email || "No email"}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <SettingTile icon={User} title="Profile" description="Your name and account identity." />
                <SettingTile icon={Package} title="Shipping Address" description="Default delivery details for checkout." />
                <SettingTile icon={Bell} title="Notifications" description="Order updates and account alerts." />
                <SettingTile icon={ShieldCheck} title="Privacy & Security" description="Account safety and sign-in protection." />
                <SettingTile icon={Palette} title="Appearance" description="Light, dark, or system display mode." />
                <SettingTile icon={HelpCircle} title="Help & Support" description="Reach the support page or contact team." />
              </div>
            </div>

            <div className="rounded-[28px] border border-chocolate/10 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-2 border-b border-chocolate/10 pb-4">
                <Package className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-chocolate">Shipping Address</h2>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="Full Name" value={settings.shippingAddress.fullName} onChange={(value) => updateShipping("fullName", value)} placeholder="Enter full name" />
                <Field label="Phone Number" value={settings.shippingAddress.phone} onChange={(value) => updateShipping("phone", value)} placeholder="Enter phone number" />
                <Field label="City / Town" value={settings.shippingAddress.city} onChange={(value) => updateShipping("city", value)} placeholder="Enter city" />
                <Field label="Street / Area" value={settings.shippingAddress.addressLine} onChange={(value) => updateShipping("addressLine", value)} placeholder="Enter address line" className="md:col-span-2" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-chocolate/10 bg-chocolate-dark p-6 text-cream shadow-2xl">
              <div className="flex items-center gap-2 border-b border-cream/10 pb-4">
                <SunMedium className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Appearance</h2>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-[10px] font-mono uppercase tracking-[0.25em] text-cream/50">Display Mode</span>
                  <select
                    value={settings.appearance}
                    onChange={(e) => setSettings((prev) => ({ ...prev, appearance: e.target.value as UserSettingsState["appearance"] }))}
                    className="w-full rounded-2xl border border-cream/10 bg-white/5 px-4 py-3 text-sm text-cream outline-none"
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </label>

                <div className="rounded-2xl border border-cream/10 bg-white/5 p-4">
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-cream/45">What this does</p>
                  <p className="mt-2 text-sm leading-relaxed text-cream/75">
                    This controls how the app should look for this account later. The current build stores the preference now, and the visual theme can be connected next.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-chocolate/10 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-2 border-b border-chocolate/10 pb-4">
                <Bell className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-chocolate">Notifications</h2>
              </div>

              <label className="mt-5 flex items-start justify-between gap-4 rounded-2xl border border-chocolate/10 bg-light-brown px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-chocolate">Order and delivery alerts</p>
                  <p className="mt-1 text-sm text-chocolate/60">Get updates about orders, delivery, and important account notices.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }))}
                  className={`relative h-7 w-12 rounded-full transition ${settings.notificationsEnabled ? "bg-gold" : "bg-chocolate/20"}`}
                  aria-pressed={settings.notificationsEnabled}
                >
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${settings.notificationsEnabled ? "left-6" : "left-1"}`} />
                </button>
              </label>
            </div>

            <div className="rounded-[28px] border border-chocolate/10 bg-white p-6 shadow-sm md:p-8 space-y-4">
              <div className="flex items-center gap-2 border-b border-chocolate/10 pb-4">
                <Lock className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-chocolate">Privacy & Security</h2>
              </div>

              <p className="text-sm leading-relaxed text-chocolate/70">
                Account safety controls can be added here later. For now, the essentials are protected by your sign-in session.
              </p>
            </div>

            <div className="rounded-[28px] border border-chocolate/10 bg-white p-6 shadow-sm md:p-8 space-y-4">
              <div className="flex items-center gap-2 border-b border-chocolate/10 pb-4">
                <HelpCircle className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-chocolate">Help & Support</h2>
              </div>
              <p className="text-sm leading-relaxed text-chocolate/70">Open the contact page for support, questions, or order help.</p>
              <button onClick={onGoToContact} className="inline-flex items-center gap-2 rounded-xl bg-chocolate px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-cream transition hover:bg-gold hover:text-chocolate">
                Contact Support
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={handleSave} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-xs font-bold uppercase tracking-[0.25em] text-chocolate transition hover:bg-cream">
                <Save className="h-4 w-4" />
                Save Settings
              </button>
              <button onClick={onSignOut} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-chocolate/10 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.25em] text-chocolate/70 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {savedToast ? (
        <div className="fixed left-1/2 top-24 z-50 -translate-x-1/2 rounded-full border border-gold/40 bg-[#0b1b33]/95 px-6 py-3 text-xs font-mono uppercase tracking-widest text-cream shadow-2xl">
          {savedToast}
        </div>
      ) : null}
    </div>
  );
}

function SettingTile({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-chocolate/10 bg-light-brown px-4 py-4 shadow-sm">
      <div className="flex items-center gap-2 text-chocolate">
        <Icon className="h-4 w-4 text-gold" />
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-chocolate/60">{description}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-[10px] font-mono uppercase tracking-[0.25em] text-chocolate/50">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-chocolate/10 bg-white px-4 py-3 text-sm text-chocolate outline-none placeholder:text-chocolate/35"
      />
    </label>
  );
}
