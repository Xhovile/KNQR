import React from "react";
import { Facebook, Instagram, Twitter, Globe } from "lucide-react";

export default function Footer() {
  const socials = [
    { name: "Facebook", icon: <Facebook className="w-4 h-4 text-chocolate" />, url: "https://facebook.com" },
    { name: "Instagram", icon: <Instagram className="w-4 h-4 text-chocolate" />, url: "https://instagram.com" },
    { name: "Twitter/X", icon: <Twitter className="w-4 h-4 text-chocolate" />, url: "https://twitter.com" },
    { name: "Website", icon: <Globe className="w-4 h-4 text-chocolate" />, url: "https://knqr.online" },
  ];

  return (
    <footer 
      className="bg-chocolate-dark text-cream py-16 px-6 border-t border-cream/5 text-center flex flex-col items-center"
      id="knqr-footer-section"
    >
      {/* Brand logo reference in footer */}
      <div className="mb-6 flex flex-col items-center select-none" id="footer-brand-sig">
        <span className="font-serif text-lg tracking-[0.3em] text-cream uppercase font-medium">KNQR</span>
        <span className="text-[8px] font-mono tracking-[0.4em] text-gold/60 uppercase mt-1">Blantyre, Malawi</span>
      </div>

      {/* Follow Us Heading */}
      <h4 
        className="text-[11px] font-mono tracking-[0.35em] text-cream/70 uppercase mb-6 font-medium select-none"
        id="footer-follow-heading"
      >
        Follow Us
      </h4>

      {/* Social Icons in Cream Squares */}
      <div className="flex justify-center items-center space-x-4 mb-10" id="footer-social-icons">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-cream hover:bg-gold hover:scale-105 transition-all duration-300 flex items-center justify-center rounded-sm shadow-md cursor-pointer"
            title={social.name}
            id={`footer-social-${social.name.toLowerCase().replace("/", "-")}`}
          >
            {social.icon}
          </a>
        ))}
      </div>

      {/* Trademark Divider Line */}
      <div className="w-16 h-[1px] bg-cream/15 mb-6" />

      {/* Copyright Line */}
      <p 
        className="text-[10px] font-mono tracking-widest text-cream/40 select-none uppercase"
        id="footer-copyright"
      >
        © 2024. All Rights Reserved.
      </p>
    </footer>
  );
}
