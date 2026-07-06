import React from "react";
import { ArrowLeft, Bell, Lock, Smartphone, ShieldCheck, ShieldOff, UserCheck, Mail, Package, CreditCard, Database, Eye, MapPin, Clock3 } from "lucide-react";

interface PrivacySecurityPageProps {
  onBack: () => void;
  onGoToContact: () => void;
}

export default function PrivacySecurityPage({ onBack, onGoToContact }: PrivacySecurityPageProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-light-brown text-chocolate">
      <div className="sticky top-0 z-20 border-b border-chocolate/10 bg-white/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="flex items-center gap-2 text-xs uppercase tracking-widest text-chocolate/70 hover:text-gold">
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </button>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-gold">Privacy & Security</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] border border-chocolate/10 bg-white p-5 shadow-sm sm:p-6 md:p-8 overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-chocolate/10 pb-5 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 max-w-3xl">
                <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-gold">Account Safety</p>
                <h1 className="mt-2 font-serif text-3xl text-chocolate sm:text-4xl">Privacy & Security</h1>
                <p className="mt-3 text-sm leading-relaxed text-chocolate/75 sm:text-base">
                  This page explains what KNQR keeps, what it uses, and where the important boundaries are. It is written for how the app actually works: one store, one operator, customer profiles, saved delivery details, and checkout handled through a payment partner.
                </p>
              </div>
              <div className="w-full rounded-2xl border border-chocolate/10 bg-light-brown px-4 py-3 md:w-[230px] md:flex-shrink-0">
                <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-chocolate/40">Current posture</p>
                <p className="mt-1 text-sm font-semibold text-chocolate">Session-protected account</p>
                <p className="mt-2 text-xs leading-relaxed text-chocolate/60">No public marketplace seller tools, no seller profiles, and no shared storefront management.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              <InfoCard icon={Database} title="What KNQR stores" description="Account identity, shipping address, cart contents while active, order history, product preferences, and admin-managed store content." />
              <InfoCard icon={CreditCard} title="What KNQR does not store" description="Card details should be handled by your payment provider. Payment credentials should not live in the app as raw sensitive text." />
              <InfoCard icon={MapPin} title="Shipping details" description="The saved shipping address is used to prefill checkout and reduce typing. Customers can still edit delivery details before confirming an order." />
              <InfoCard icon={Package} title="Order records" description="Orders are kept so the shop can confirm purchases, review status, and support delivery follow-up." />
              <InfoCard icon={Eye} title="Visibility" description="Only the store owner or authorized account should access admin functions. Customers should not see owner-only controls." />
              <InfoCard icon={Clock3} title="Retention" description="Keep customer data only as long as it is needed for orders, support, and lawful business records." />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <SectionBlock
                icon={ShieldCheck}
                title="Security practices"
                bullets={[
                  "Use sign-in for authenticated features.",
                  "Keep owner actions separate from customer actions.",
                  "Protect order and profile data behind the logged-in session.",
                  "Prefer HTTPS and secure backend rules when the app is live.",
                ]}
              />
              <SectionBlock
                icon={Bell}
                title="Notifications and alerts"
                bullets={[
                  "Order and delivery updates can be shown in-app.",
                  "Notifications should stay relevant to purchases and account changes.",
                  "No noisy marketing spam by default.",
                ]}
              />
              <SectionBlock
                icon={Smartphone}
                title="Device and session trust"
                bullets={[
                  "You can keep a device signed in for convenience.",
                  "Shared devices should always sign out when finished.",
                  "Session trust is for convenience, not a replacement for real account security later.",
                ]}
              />
              <SectionBlock
                icon={UserCheck}
                title="Customer controls"
                bullets={[
                  "Update shipping address from Settings.",
                  "Change appearance and notification preference.",
                  "Return to Contact if you need help with an order or account question.",
                ]}
              />
            </div>

            <div className="mt-6 rounded-3xl border border-chocolate/10 bg-chocolate-dark p-5 text-cream shadow-2xl sm:p-6 md:p-8">
              <div className="flex items-center gap-2 border-b border-cream/10 pb-4">
                <Lock className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Important notes</h2>
              </div>
              <div className="mt-4 grid gap-3 text-sm leading-relaxed text-cream/80 sm:grid-cols-2">
                <p>• KNQR is a single-shop system, not a marketplace.</p>
                <p>• The owner controls product publishing, hero images, and store operations.</p>
                <p>• Customers should not be exposed to internal admin tools.</p>
                <p>• Any payment processor handles its own payment layer during checkout.</p>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button onClick={onGoToContact} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-xs font-bold uppercase tracking-[0.25em] text-chocolate transition hover:bg-cream">
                  Contact Support
                </button>
                <button onClick={onBack} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-cream/10 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.25em] text-cream transition hover:border-gold hover:text-gold">
                  Back to Settings
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6 min-w-0">
            <div className="rounded-[32px] border border-chocolate/10 bg-white p-5 shadow-sm sm:p-6 md:p-8 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-chocolate/10 pb-4">
                <ShieldOff className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-chocolate">What this page is not</h2>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-chocolate/70">
                <p>It is not a legal substitute for a formal privacy policy or terms document.</p>
                <p>It is not a payment processor agreement.</p>
                <p>It is not a public user data export screen.</p>
              </div>
            </div>

            <div className="rounded-[32px] border border-chocolate/10 bg-white p-5 shadow-sm sm:p-6 md:p-8 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-chocolate/10 pb-4">
                <Mail className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-chocolate">Support and contact</h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-chocolate/70">
                Use Contact when a customer needs help with an order, delivery issue, account question, or anything the shop owner needs to clarify.
              </p>
              <button onClick={onGoToContact} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-chocolate px-4 py-3 text-xs font-bold uppercase tracking-[0.25em] text-cream transition hover:bg-gold hover:text-chocolate">
                Open Contact
              </button>
            </div>

            <div className="rounded-[32px] border border-chocolate/10 bg-white p-5 shadow-sm sm:p-6 md:p-8 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-chocolate/10 pb-4">
                <Database className="h-4 w-4 text-gold" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-chocolate">Data scope</h2>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-chocolate/70">
                <p>• Profile info: name and email.</p>
                <p>• Delivery info: name, phone, city, address.</p>
                <p>• Commerce info: cart, orders, and product selections.</p>
                <p>• Store info: content managed by the owner.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
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
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-chocolate/65">{description}</p>
    </div>
  );
}

function SectionBlock({
  icon: Icon,
  title,
  bullets,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  bullets: string[];
}) {
  return (
    <div className="rounded-2xl border border-chocolate/10 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-chocolate/10 pb-3 text-chocolate">
        <Icon className="h-4 w-4 text-gold" />
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-chocolate/70">
        {bullets.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
