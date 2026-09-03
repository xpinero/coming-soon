import Link from "next/link";
import type { CatalogItem } from "@/data/catalog";
import { formatUsd } from "@/lib/money";
import { pricing } from "@/data/pricing";

export function CatalogCard({ item }: { item: CatalogItem }) {
  const fromCents = item.grams * pricing.inStockPerGramCents + pricing.handlingFeeCents;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-[#121a16] transition hover:-translate-y-1 hover:border-[#3dd68c]/40">
      <div
        className="relative flex h-40 items-center justify-center"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${item.accent}33, transparent 55%), #1a2620`,
        }}
      >
        <span className="text-5xl text-white/80" aria-hidden>
          {item.category === "Desk" ? "▣" : item.category === "Home" ? "❀" : "⬡"}
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2 py-0.5 text-xs uppercase tracking-wider text-[#e8f0ec]">
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl text-[#e8f0ec]">
          {item.name}
        </h2>
        <p className="flex-1 text-sm leading-relaxed text-[#9ca8a3]">{item.summary}</p>
        <div className="flex items-end justify-between gap-3">
          <p className="text-sm text-[#5c6b64]">
            {item.grams}g · from {formatUsd(fromCents)}
          </p>
          <Link
            href={`/print/${item.slug}`}
            className="rounded-full bg-[#3dd68c] px-4 py-2 text-sm font-medium text-[#0a0f0d] transition hover:bg-[#2dd4bf]"
          >
            Configure
          </Link>
        </div>
      </div>
    </article>
  );
}
