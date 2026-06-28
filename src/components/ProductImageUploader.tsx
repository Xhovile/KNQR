import React, { useState, useRef } from "react";
import { Upload, Trash2, HelpCircle } from "lucide-react";

interface ProductImageUploaderProps {
  images: string[];
  primaryImage: string;
  onImagesChange: (urls: string[]) => void;
  onPrimaryChange: (url: string) => void;
  errors?: Record<string, string>;
}

// Preset luxury images from the workspace for quick selection
const PRESET_IMAGES = [
  { label: "Hero Model", url: "/src/assets/images/knqr_hero_model_1782618845727.jpg" },
  { label: "Earthy Apparel", url: "/src/assets/images/knqr_apparel_new_1782625253891.jpg" },
  { label: "Sculpted Accessory", url: "/src/assets/images/knqr_accessory_new_1782625265014.jpg" },
  { label: "Noir Essence Fragrance", url: "/src/assets/images/knqr_fragrance_new_1782625278359.jpg" },
  { label: "Luxe Necklace", url: "/src/assets/images/knqr_necklace_1782618869518.jpg" },
  { label: "Classic Black Shirt", url: "/src/assets/images/knqr_black_shirt_1782625829276.jpg" },
  { label: "Tailored Trousers", url: "/src/assets/images/knqr_trousers_1782618856513.jpg" },
];

export default function ProductImageUploader({
  images = [],
  primaryImage = "",
  onImagesChange,
  onPrimaryChange,
  errors = {},
}: ProductImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList) => {
    const loadedUrls: string[] = [];
    let count = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === "string") {
          loadedUrls.push(e.target.result);
          count++;

          if (count === files.length) {
            const updatedImages = [...images, ...loadedUrls];
            onImagesChange(updatedImages);

            // If primary is empty, set first as primary
            if (!primaryImage) {
              onPrimaryChange(loadedUrls[0]);
            }
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const removedUrl = images[indexToRemove];
    const nextImages = images.filter((_, idx) => idx !== indexToRemove);
    onImagesChange(nextImages);

    if (primaryImage === removedUrl) {
      onPrimaryChange(nextImages[0] || "");
    }
  };

  const handleSelectPresetImage = (url: string) => {
    if (!images.includes(url)) {
      onImagesChange([...images, url]);
      if (!primaryImage) {
        onPrimaryChange(url);
      }
    } else {
      onPrimaryChange(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
          dragActive
            ? "border-gold bg-gold/5"
            : "border-cream/15 hover:border-gold/45 bg-chocolate/30"
        }`}
        id="media-drop-zone"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/*"
          className="hidden"
        />
        <Upload className="w-10 h-10 text-gold mb-3 animate-pulse" />
        <p className="text-xs tracking-wider uppercase font-mono text-cream/80 text-center">
          Drag & Drop Images here
        </p>
        <p className="text-[10px] text-cream/40 mt-1.5 text-center uppercase font-sans">
          or click to browse local files (processed locally via base64)
        </p>
      </div>

      {/* Luxury Preset Selection */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono tracking-widest uppercase text-cream/55 flex items-center space-x-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-gold" />
          <span>Quick-select high-res preset images from the workspace</span>
        </label>
        <div className="flex gap-2 overflow-x-auto pb-3 select-none scrollbar-thin">
          {PRESET_IMAGES.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleSelectPresetImage(preset.url)}
              className="px-3 py-1.5 bg-chocolate border border-cream/10 rounded-lg text-[10px] tracking-wider uppercase font-mono text-cream/70 hover:text-gold hover:border-gold/50 transition-all shrink-0 cursor-pointer"
            >
              + {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <label className="text-[10px] font-mono tracking-widest uppercase text-gold">
            Media Gallery ({images.length} item{images.length > 1 ? "s" : ""})
          </label>
          <p className="text-[10px] font-mono text-cream/40 uppercase">
            💡 Click on any image below to designate it as the <strong className="text-gold">Primary Cover Image</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="image-preview-grid">
            {images.map((url, idx) => {
              const isPrimary = primaryImage === url;
              return (
                <div
                  key={idx}
                  className={`relative aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all ${
                    isPrimary ? "border-gold ring-2 ring-gold/20" : "border-cream/10"
                  }`}
                >
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => onPrimaryChange(url)}
                    referrerPolicy="no-referrer"
                  />

                  {/* Overlay indicators */}
                  {isPrimary && (
                    <div className="absolute top-2 left-2 bg-gold text-chocolate font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Primary
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute bottom-2 right-2 p-1.5 bg-chocolate-dark/80 hover:bg-rose-600 rounded-lg text-cream/70 hover:text-white transition-colors cursor-pointer"
                    title="Remove image from gallery"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {errors.images && (
        <p className="text-xs text-rose-400 font-mono tracking-wide">{errors.images}</p>
      )}
      {errors.image && (
        <p className="text-xs text-rose-400 font-mono tracking-wide">{errors.image}</p>
      )}
    </div>
  );
}
