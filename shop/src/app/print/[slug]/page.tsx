import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PrintForm } from "@/components/PrintForm";
import { getCatalogItem } from "@/data/catalog";
import { pricing } from "@/data/pricing";
import { formatPerGram, formatUsd } from "@/lib/money";

export default async function PrintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getCatalogItem(slug);
  if (!item) {
    notFound();
  }

  const fromCents = item.grams * pricing.inStockPerGramCents + pricing.handlingFeeCents;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-[#5c6b64]">{item.category}</p>
      <h1 className="mt-3 font-[family-name:var(--font-heading)] text-5xl text-[#e8f0ec]">
        {item.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[#9ca8a3]">{item.description}</p>
      <p className="mt-3 text-sm text-[#5c6b64]">
        {item.grams}g each · from {formatUsd(fromCents)} in an in-stock color (
        {formatPerGram(pricing.inStockPerGramCents)})
      </p>
      {item.makerWorldUrl ? (
        <p className="mt-3">
          <a
            href={item.makerWorldUrl}
            className="text-[#3dd68c] hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            View on MakerWorld
          </a>
        </p>
      ) : null}
      <div className="mt-10">
        <Suspense>
          <PrintForm item={item} />
        </Suspense>
      </div>
    </div>
  );
}
