"use client";

import { filamentColors, type FilamentColor } from "@/data/inventory";

export function ColorSwatches({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: FilamentColor) => void;
}) {
  const inStock = filamentColors.filter((color) => color.inStock);
  const rest = filamentColors.filter((color) => !color.inStock);

  return (
    <div className="space-y-5">
      <ColorGroup
        title="In stock — per-gram rate"
        colors={inStock}
        value={value}
        onChange={onChange}
      />
      <ColorGroup
        title="Not in stock — full commercial rate"
        colors={rest}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function ColorGroup({
  title,
  colors,
  value,
  onChange,
}: {
  title: string;
  colors: FilamentColor[];
  value: string;
  onChange: (color: FilamentColor) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs uppercase tracking-[0.18em] text-[#5c6b64]">
        {title}
      </legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {colors.map((color) => {
          const selected = color.id === value;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onChange(color)}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition ${
                selected
                  ? "border-[#3dd68c] bg-[#3dd68c]/10"
                  : "border-white/10 bg-transparent hover:border-white/25"
              }`}
            >
              <span
                className="h-6 w-6 shrink-0 rounded-full border border-white/20"
                style={{ backgroundColor: color.hex }}
              />
              <span>
                <span className="block text-[#e8f0ec]">{color.name}</span>
                <span className="block text-xs text-[#5c6b64]">{color.material}</span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
