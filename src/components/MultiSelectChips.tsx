import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface MultiSelectChipsProps {
  selectedValues: string[];
  options?: string[];
  onChange: (values: string[]) => void;
  allowCustom?: boolean;
  customPlaceholder?: string;
}

export default function MultiSelectChips({
  selectedValues = [],
  options = [],
  onChange,
  allowCustom = false,
  customPlaceholder = "Add custom...",
}: MultiSelectChipsProps) {
  const [customInput, setCustomInput] = useState("");

  const handleToggleOption = (option: string) => {
    const isSelected = selectedValues.includes(option);
    const nextValues = isSelected
      ? selectedValues.filter((v) => v !== option)
      : [...selectedValues, option];
    onChange(nextValues);
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selectedValues.includes(trimmed)) {
      onChange([...selectedValues, trimmed]);
      setCustomInput("");
    }
  };

  return (
    <div className="space-y-3">
      {/* Predefined Chip list */}
      {options.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleToggleOption(option)}
                className={`px-3.5 py-2 text-xs font-mono tracking-wider border rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cream text-chocolate border-cream font-bold shadow-md shadow-black/10 scale-[1.02]"
                    : "bg-chocolate/40 border border-cream/15 text-cream/70 hover:border-cream/35 hover:text-cream"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}

      {/* Selected tags when options list is empty or custom is used */}
      {allowCustom && (
        <div className="space-y-3">
          {/* Custom Input */}
          <div className="flex items-center space-x-2 max-w-sm">
            <input
              type="text"
              placeholder={customPlaceholder}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustom();
                }
              }}
              className="flex-1 bg-chocolate/40 border border-cream/15 rounded-xl px-4 py-2.5 text-xs text-cream focus:outline-none focus:border-gold placeholder-cream/30"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className="p-2.5 bg-cream hover:bg-gold text-chocolate rounded-xl transition-all cursor-pointer"
              title="Add Custom Item"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Render selected items not in option presets if presets exist, or all if no presets */}
          {selectedValues.length > 0 && (
            <div className="space-y-1.5 max-w-md pt-1">
              <span className="text-[9px] font-mono uppercase text-cream/35">Selected List:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedValues.map((val) => (
                  <div
                    key={val}
                    className="flex items-center space-x-1.5 bg-chocolate border border-cream/10 px-2.5 py-1.5 rounded-lg text-cream text-[11px] font-mono font-medium"
                  >
                    <span>{val}</span>
                    <button
                      type="button"
                      onClick={() => onChange(selectedValues.filter((v) => v !== val))}
                      className="text-cream/40 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
