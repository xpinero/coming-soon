import { getColor, type FilamentColor } from "./inventory";

/** All money values are integer USD cents. */
export const pricing = {
  /** Discounted rate when the filament is already on the shelf. */
  inStockPerGramCents: 12,
  /**
   * Full commercial rate when filament has to be ordered.
   * This is the "not in stock" price — higher per gram, no hobby discount.
   */
  outOfStockPerGramCents: 30,
  /** Covers buying and loading a new color. Only applied when out of stock. */
  outOfStockRestockFeeCents: 600,
  /** Packing / order handling, charged once per order. */
  handlingFeeCents: 250,
  minOrderCents: 500,
  minGrams: 5,
  maxGrams: 800,
  maxQuantity: 10,
} as const;

export type QuoteInput = {
  grams: number;
  quantity: number;
  color: FilamentColor;
};

export type PrintQuote = {
  grams: number;
  quantity: number;
  totalGrams: number;
  color: FilamentColor;
  perGramCents: number;
  printCents: number;
  restockFeeCents: number;
  handlingFeeCents: number;
  subtotalCents: number;
};

export class QuoteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuoteError";
  }
}

export function perGramCentsFor(color: FilamentColor): number {
  return color.inStock
    ? pricing.inStockPerGramCents
    : pricing.outOfStockPerGramCents;
}

export function quotePrint(input: QuoteInput): PrintQuote {
  const grams = Number(input.grams);
  const quantity = Number(input.quantity);

  if (!Number.isFinite(grams) || grams < pricing.minGrams || grams > pricing.maxGrams) {
    throw new QuoteError(
      `Weight must be between ${pricing.minGrams}g and ${pricing.maxGrams}g.`,
    );
  }

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > pricing.maxQuantity
  ) {
    throw new QuoteError(`Quantity must be between 1 and ${pricing.maxQuantity}.`);
  }

  const totalGrams = Math.round(grams * quantity);
  const perGramCents = perGramCentsFor(input.color);
  const printCents = totalGrams * perGramCents;
  const restockFeeCents = input.color.inStock
    ? 0
    : pricing.outOfStockRestockFeeCents;
  const handlingFeeCents = pricing.handlingFeeCents;
  const subtotalCents = Math.max(
    pricing.minOrderCents,
    printCents + restockFeeCents + handlingFeeCents,
  );

  return {
    grams,
    quantity,
    totalGrams,
    color: input.color,
    perGramCents,
    printCents,
    restockFeeCents,
    handlingFeeCents,
    subtotalCents,
  };
}

export function quotePrintByColorId(
  grams: number,
  quantity: number,
  colorId: string,
): PrintQuote {
  const color = getColor(colorId);
  if (!color) {
    throw new QuoteError("Choose a filament color that is on the list.");
  }
  return quotePrint({ grams, quantity, color });
}
