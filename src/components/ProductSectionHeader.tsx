import React from "react";
import { Sparkles, DollarSign, Upload, Layers, Truck, ListPlus } from "lucide-react";

interface ProductSectionHeaderProps {
  sectionKey: string;
  title: string;
  description?: string;
}

export default function ProductSectionHeader({
  sectionKey,
  title,
  description,
}: ProductSectionHeaderProps) {
  const getIcon = () => {
    switch (sectionKey) {
      case "basic":
        return <Sparkles className="w-5 h-5 text-gold shrink-0" />;
      case "pricing":
        return <DollarSign className="w-5 h-5 text-gold shrink-0" />;
      case "media":
        return <Upload className="w-5 h-5 text-gold shrink-0" />;
      case "variants":
        return <Layers className="w-5 h-5 text-gold shrink-0" />;
      case "delivery":
        return <Truck className="w-5 h-5 text-gold shrink-0" />;
      case "extras":
        return <ListPlus className="w-5 h-5 text-gold shrink-0" />;
      default:
        return <Sparkles className="w-5 h-5 text-gold shrink-0" />;
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-3">
        {getIcon()}
        <h3 className="font-serif text-lg tracking-wide text-cream">{title}</h3>
      </div>
      {description && (
        <p className="text-[11px] font-mono text-cream/45 uppercase tracking-wider pl-8">
          {description}
        </p>
      )}
    </div>
  );
}
