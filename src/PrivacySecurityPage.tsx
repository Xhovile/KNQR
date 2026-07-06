import React from "react";
import { ArrowLeft, Bell, Lock, ShieldCheck, ShieldOff, Smartphone, UserCheck } from "lucide-react";

interface PrivacySecurityPageProps {
  onBack: () => void;
  onGoToContact: () => void;
}

export default function PrivacySecurityPage({ onBack, onGoToContact }: PrivacySecurityPageProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-light-brown text-chocolate">
      <div className="sticky top-0 z-20 border-b border-chocolate/10 bg-white/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <button onClick={onBack} className="flex items-center gap-2 text-xs uppercase tracking-widest text-chocolate/70 hover:text-gold">
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </button>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-gold">Privacy & Security</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        <div className="rounded-[28px] border border-chocolate/10 bg-white p-5 shadow-sm sm:p-6 md:p-8">
          <div className="flex flex-col gap-4 border-b border-chocolate/10 pb-5 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-gold">Account Safety</p>
              <h1 className="mt-2 font-serif text-3xl text-chocolate">Privacy & Security</h1>
              <p className="mt-2 text-sm text-chocolate/70">Keep the essentials visible. The rest can stay out of the way.</p>
            </div>
            <div className="rounded-2xl border border-chocolate/10 bg-light-brown px-4 py-3">
              <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-chocolate/40">Current state</p>
              <p className="mt-1 text-sm font-medium text-chocolate">Protected by sign-in session</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <SafetyCard icon={ShieldCheck} title="Secure Sign-In" description="Your session is already protected by the current login system." />
            <SafetyCard icon={Bell} title="Security Alerts" description="Order and account alerts can notify you when something changes." />
            <SafetyCard icon={Smartphone} title="Trusted Device" description="This browser can stay remembered for easier return visits." />
            <SafetyCard icon={UserCheck} title="Account Identity" description="Your account identity stays tied to your KNQR profile." />
          </div>

          <div className="mt-6 rounded-2xl border border-chocolate/10 bg-chocolate-dark p-5 text-cream shadow-2xl sm:p-6 md:p-8">
            <div className="flex items-center gap-2 border-b border-cream/10 pb-4">
              <Lock className="h-4 w-4 text-gold" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">What belongs here</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-cream/75">
              <p>• Password and sign-in protection later on.</p>
              <p>• Session and device trust controls later on.</p>
              <p>• Order privacy and account visibility rules later on.</p>
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
      </div>
    </div>
  );
}

function SafetyCard({
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
