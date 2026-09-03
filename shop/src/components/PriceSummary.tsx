import type { PrintQuote } from "@/data/pricing";
import { shippingOptionsFor } from "@/data/shipping";
import { formatPerGram, formatUsd } from "@/lib/money";

export function PriceSummary({ quote }: { quote: PrintQuote }) {
  const shipping = shippingOptionsFor(quote.totalGrams);
  const cheapest = shipping[0];

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-[#121a16] p-5">
      <h3 className="font-[family-name:var(--font-heading)] text-xl text-[#e8f0ec]">
        Quote
      </h3>
      <Row
        label={`${quote.totalGrams}g × ${formatPerGram(quote.perGramCents)}`}
        value={formatUsd(quote.printCents)}
      />
      {quote.restockFeeCents > 0 && (
        <Row label="Color restock (not in stock)" value={formatUsd(quote.restockFeeCents)} />
      )}
      <Row label="Packing & handling" value={formatUsd(quote.handlingFeeCents)} />
      <div className="border-t border-white/10 pt-3">
        <Row label="Print subtotal" value={formatUsd(quote.subtotalCents)} strong />
      </div>
      <p className="text-xs leading-relaxed text-[#5c6b64]">
        Shipping is added at checkout. Ground from {formatUsd(cheapest.amountCents)} for this
        weight. {quote.color.inStock
          ? `${quote.color.name} is on the shelf, so you get the in-stock rate.`
          : `${quote.color.name} is not in stock, so this uses the full commercial rate.`}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={`flex items-baseline justify-between gap-4 ${strong ? "text-[#e8f0ec]" : "text-[#9ca8a3]"}`}>
      <span>{label}</span>
      <span className={strong ? "text-lg font-semibold text-[#3dd68c]" : ""}>{value}</span>
    </div>
  );
}
