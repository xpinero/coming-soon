export type FilamentColor = {
  id: string;
  name: string;
  hex: string;
  material: "PLA" | "PETG";
  inStock: boolean;
};

/**
 * Edit this list to match filament you actually have on the printer.
 * In-stock colors are billed at the discounted per-gram rate.
 * Out-of-stock colors are billed at the full commercial per-gram rate.
 */
export const filamentColors: FilamentColor[] = [
  { id: "pla-black", name: "Black", hex: "#1a1a1a", material: "PLA", inStock: true },
  { id: "pla-white", name: "White", hex: "#f4f4f0", material: "PLA", inStock: true },
  { id: "pla-forest", name: "Forest Green", hex: "#1f6b45", material: "PLA", inStock: true },
  { id: "pla-teal", name: "Aurora Teal", hex: "#2dd4bf", material: "PLA", inStock: true },
  { id: "pla-orange", name: "Sun Orange", hex: "#f97316", material: "PLA", inStock: true },
  { id: "pla-red", name: "Red", hex: "#dc2626", material: "PLA", inStock: false },
  { id: "pla-blue", name: "Blue", hex: "#2563eb", material: "PLA", inStock: false },
  { id: "pla-gold", name: "Silk Gold", hex: "#eab308", material: "PLA", inStock: false },
  { id: "petg-clear", name: "Clear PETG", hex: "#cbd5e1", material: "PETG", inStock: false },
];

export function getColor(id: string): FilamentColor | undefined {
  return filamentColors.find((color) => color.id === id);
}

export function inStockColors(): FilamentColor[] {
  return filamentColors.filter((color) => color.inStock);
}

export function outOfStockColors(): FilamentColor[] {
  return filamentColors.filter((color) => !color.inStock);
}
