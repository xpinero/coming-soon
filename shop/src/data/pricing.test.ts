import { catalog } from "./catalog";
import { filamentColors } from "./inventory";
import { quotePrintByColorId } from "./pricing";
import { shippingOptionsFor } from "./shipping";

const assert = (condition: unknown, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok  ${name}`);
  } catch (error) {
    console.error(`fail  ${name}`);
    throw error;
  }
}

run("in-stock color uses the discounted per-gram rate", () => {
  const inStock = filamentColors.find((color) => color.inStock);
  assert(inStock, "need an in-stock color");
  const quote = quotePrintByColorId(50, 1, inStock!.id);
  assert(quote.perGramCents === 12, `expected 12, got ${quote.perGramCents}`);
  assert(quote.printCents === 600, `expected 600, got ${quote.printCents}`);
  assert(quote.restockFeeCents === 0, "in-stock should not include restock");
  assert(quote.subtotalCents === 850, `expected 850, got ${quote.subtotalCents}`);
});

run("out-of-stock color uses full per-gram rate plus restock fee", () => {
  const out = filamentColors.find((color) => !color.inStock);
  assert(out, "need an out-of-stock color");
  const quote = quotePrintByColorId(50, 1, out!.id);
  assert(quote.perGramCents === 30, `expected 30, got ${quote.perGramCents}`);
  assert(quote.printCents === 1500, `expected 1500, got ${quote.printCents}`);
  assert(quote.restockFeeCents === 600, "out-of-stock should include restock");
  assert(quote.subtotalCents === 2350, `expected 2350, got ${quote.subtotalCents}`);
});

run("quantity multiplies grams before pricing", () => {
  const inStock = filamentColors.find((color) => color.inStock)!;
  const quote = quotePrintByColorId(12, 3, inStock.id);
  assert(quote.totalGrams === 36, `expected 36g, got ${quote.totalGrams}`);
  assert(quote.printCents === 432, `expected 432, got ${quote.printCents}`);
});

run("catalog items have positive gram weights", () => {
  assert(
    catalog.every((item) => item.grams >= 5),
    "every catalog item needs a realistic gram weight",
  );
});

run("shipping tiers increase with weight", () => {
  const light = shippingOptionsFor(40);
  const heavy = shippingOptionsFor(400);
  assert(light[0].amountCents < heavy[0].amountCents, "heavier prints should ship for more");
  assert(light.length === 2 && heavy.length === 2, "ground and priority");
});

run("unknown color is rejected", () => {
  let threw = false;
  try {
    quotePrintByColorId(20, 1, "not-a-color");
  } catch {
    threw = true;
  }
  assert(threw, "expected QuoteError");
});

console.log("All pricing tests passed.");
