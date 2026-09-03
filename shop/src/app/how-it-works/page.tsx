import { pricing } from "@/data/pricing";
import { inStockColors, outOfStockColors } from "@/data/inventory";
import { formatPerGram, formatUsd } from "@/lib/money";

export const metadata = {
  title: "How pricing works",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-5xl">How pricing works</h1>
      <div className="mt-8 space-y-8 text-[#9ca8a3] leading-relaxed">
        <section>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl text-[#e8f0ec]">
            Two rates
          </h2>
          <p className="mt-3">
            In-stock colors are {formatPerGram(pricing.inStockPerGramCents)}. Colors that
            are not on the shelf are billed at the full commercial rate of{" "}
            {formatPerGram(pricing.outOfStockPerGramCents)}, plus a{" "}
            {formatUsd(pricing.outOfStockRestockFeeCents)} restock fee to cover buying and
            loading that filament.
          </p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl text-[#e8f0ec]">
            On the shelf
          </h2>
          <p className="mt-3">{inStockColors().map((color) => color.name).join(", ")}.</p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl text-[#e8f0ec]">
            Full price
          </h2>
          <p className="mt-3">
            {outOfStockColors().map((color) => color.name).join(", ")}. Ask if you want a
            color that is not listed — I can usually order it at the full rate.
          </p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl text-[#e8f0ec]">
            Shipping
          </h2>
          <p className="mt-3">
            Packed to order and shipped in the US and Canada. Checkout shows Ground and
            Priority based on the print weight. A {formatUsd(pricing.handlingFeeCents)} packing
            fee is added once per order.
          </p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl text-[#e8f0ec]">
            MakerWorld
          </h2>
          <p className="mt-3">
            I print models I designed or models with a commercial license. If a special
            request cannot be printed, I refund before I start.
          </p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl text-[#e8f0ec]">
            QR codes
          </h2>
          <p className="mt-3">
            Point a QR code at{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-[#e8f0ec]">
              https://shop.xaverpinero.com/?src=qr
            </code>{" "}
            or a specific print such as{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-[#e8f0ec]">
              /print/trail-clip?src=qr
            </code>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
