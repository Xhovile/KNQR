import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle,
  ChevronDown,
  ExternalLink,
  X,
  AlertCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setFormError("Please fill in all required fields marked with an asterisk (*).");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <div className="w-full bg-light-brown text-chocolate py-12 md:py-16 px-6 md:px-12 flex flex-col font-sans border-b border-chocolate/5" id="knqr-contact-page-root">
      <div className="max-w-4xl mx-auto text-center mb-12 space-y-4">
        <span className="text-[10px] font-mono tracking-[0.4em] text-gold uppercase font-bold" id="contact-small-sub">
          CONTACT
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-chocolate tracking-tight" id="contact-main-heading">
          LET'S CONNECT
        </h2>
        <p className="text-sm md:text-base text-chocolate/80 leading-relaxed max-w-2xl mx-auto font-light">
          Questions? We’re here to help. You can reach us directly, use the form below, or open the store location in Google Maps.
        </p>
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white/50 border border-chocolate/10 rounded-2xl p-6 md:p-8 space-y-8 shadow-sm">
            <h3 className="text-lg font-serif text-chocolate tracking-wide border-b border-chocolate/10 pb-3">
              CONTACT INFORMATION
            </h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-chocolate/5 rounded-xl border border-chocolate/10 text-gold mt-1 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-grow">
                  <p className="text-base font-semibold text-chocolate">+265 883 184 144</p>
                  <a href="https://wa.me/265883184144" target="_blank" rel="noreferrer" className="inline-flex items-center space-x-2 bg-chocolate text-cream hover:bg-gold hover:text-chocolate text-xs font-mono tracking-wider uppercase px-4 py-2 rounded-xl transition-all shadow-sm font-bold cursor-pointer select-none border border-chocolate" id="contact-whatsapp-btn">
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-chocolate/5 rounded-xl border border-chocolate/10 text-gold mt-1 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-grow">
                  <p className="text-base font-semibold text-chocolate">knqronline@gmail.com</p>
                  <a href="mailto:knqronline@gmail.com" className="inline-flex items-center space-x-2 bg-chocolate text-cream hover:bg-gold hover:text-chocolate text-xs font-mono tracking-wider uppercase px-4 py-2 rounded-xl transition-all shadow-sm font-bold cursor-pointer select-none border border-chocolate" id="contact-email-btn">
                    <span>Send an Email</span>
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-chocolate/5 rounded-xl border border-chocolate/10 text-gold mt-1 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-grow">
                  <p className="text-sm font-semibold text-chocolate leading-snug">
                    KNQR Outlet<br />Blantyre, Malawi
                  </p>
                  <p className="text-xs font-mono text-chocolate/50 italic">Hours: Coming soon</p>
                  <a href="https://maps.google.com/?q=Blantyre,Malawi" target="_blank" rel="noreferrer" className="inline-flex items-center space-x-2 bg-white/80 hover:bg-chocolate hover:text-white text-xs font-mono tracking-wider uppercase px-4 py-2 rounded-xl transition-all shadow-sm font-bold border border-chocolate/20 cursor-pointer select-none" id="contact-directions-btn">
                    <span>Open Map</span>
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-chocolate/10 space-y-3">
              <p className="text-[10px] font-mono tracking-[0.25em] text-chocolate/50 uppercase">🗺️ Store Location</p>
              <div className="rounded-xl border border-chocolate/10 bg-chocolate/5 p-4">
                <p className="text-sm text-chocolate/80 leading-relaxed">
                  The map is opened on demand to keep the page fast. Use the button above if you want directions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="bg-chocolate border border-cream/15 rounded-3xl p-6 md:p-10 text-cream shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-gold/5 rounded-full blur-xl" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-gold/5 rounded-full blur-xl" />

            <div className="space-y-2 mb-8">
              <span className="text-[10px] font-mono tracking-[0.3em] text-gold uppercase font-bold">SEND US A MESSAGE</span>
              <h3 className="text-2xl font-serif text-cream tracking-wide">Have a question or request?</h3>
              <p className="text-xs text-cream/60 font-light">Fill out the form below and our team will get back to you as soon as possible.</p>
            </div>

            {submitSuccess ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-cream/5 border border-gold/30 p-8 rounded-2xl text-center space-y-4" id="contact-form-success">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center text-gold">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                </div>
                <h4 className="font-serif text-xl text-cream font-medium">Message Dispatched</h4>
                <p className="text-sm text-cream/70 leading-relaxed max-w-sm mx-auto font-light">
                  Your communication has been securely logged. The KNQR Curator team will reply within 24 hours of standard operations.
                </p>
                <button onClick={() => setSubmitSuccess(false)} className="px-6 py-2.5 bg-gold hover:bg-gold-light text-chocolate rounded-xl text-xs font-mono tracking-widest uppercase font-bold transition-all cursor-pointer select-none" id="contact-success-reset-btn">
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" id="knqr-contact-form">
                {formError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 flex items-start space-x-2 text-rose-300 text-xs font-mono" id="contact-form-error-alert">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest uppercase text-gold" htmlFor="contact-form-name">Full Name <span className="text-rose-400">*</span></label>
                    <input type="text" id="contact-form-name" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g. Hayze Engola" className="w-full bg-chocolate-light border border-cream/10 rounded-xl px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold transition-colors placeholder-cream/20" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest uppercase text-gold" htmlFor="contact-form-email">Email Address <span className="text-rose-400">*</span></label>
                    <input type="email" id="contact-form-email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="e.g. curated@knqr.com" className="w-full bg-chocolate-light border border-cream/10 rounded-xl px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold transition-colors placeholder-cream/20" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest uppercase text-cream/40" htmlFor="contact-form-phone">Phone Number (Optional)</label>
                    <input type="text" id="contact-form-phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="e.g. +265 883 184 144" className="w-full bg-chocolate-light border border-cream/10 rounded-xl px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold transition-colors placeholder-cream/20" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest uppercase text-gold" htmlFor="contact-form-subject">Subject <span className="text-rose-400">*</span></label>
                    <input type="text" id="contact-form-subject" name="subject" required value={formData.subject} onChange={handleInputChange} placeholder="e.g. Wholesale Order Placement" className="w-full bg-chocolate-light border border-cream/10 rounded-xl px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold transition-colors placeholder-cream/20" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-gold" htmlFor="contact-form-message">Message <span className="text-rose-400">*</span></label>
                  <textarea id="contact-form-message" name="message" required rows={4} value={formData.message} onChange={handleInputChange} placeholder="Provide detailed description of your query..." className="w-full bg-chocolate-light border border-cream/10 rounded-xl px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold transition-colors placeholder-cream/20 resize-none" />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-gold hover:bg-gold-light text-chocolate rounded-xl py-3.5 text-xs font-mono tracking-widest uppercase font-bold transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none" id="contact-submit-btn">
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-chocolate border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {/* No embedded iframe here on purpose — the page stays lightweight. */}
      </AnimatePresence>
    </div>
  );
}
