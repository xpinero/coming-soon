import Link from "next/link";
import { CatalogCard } from "@/components/CatalogCard";
import { catalog } from "@/data/catalog";
import { inStockColors } from "@/data/inventory";
import { pricing } from "@/data/pricing";
import { formatPerGram } from "@/lib/money";
import { site } from "@/lib/site";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ src?: string }>;
}) {
  const { src } = await searchParams;
  const fromQr = src === "qr";

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(61,214,140,0.18),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(168,85,247,0.12),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          {fromQr && (
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#3dd68c]">
              Scanned from QR
            </p>
          )}
          <p className="text-sm uppercase tracking-[0.28em] text-[#9ca8a3]">
            {site.owner} · print shop
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-5xl leading-tight text-[#e8f0ec] sm:text-7xl">
            3D prints,
            <span className="block text-[#3dd68c]">priced by the gram.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#9ca8a3]">
            Pick a model, a color I have on the shelf, and I will print and ship it.
            In-stock filament is {formatPerGram(pricing.inStockPerGramCents)}. Colors I
            have to order are billed at the full {formatPerGram(pricing.outOfStockPerGramCents)}{" "}
            commercial rate.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/request"
              className="rounded-full bg-[#3dd68c] px-5 py-3 text-sm font-medium text-[#0a0f0d]"
            >
              Special request
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-full border border-white/15 px-5 py-3 text-sm text-[#e8f0ec]"
            >
              How pricing works
            </Link>
          </div>
          <p className="mt-6 text-sm text-[#5c6b64]">
            Colors on the shelf right now:{" "}
            {inStockColors()
              .map((color) => color.name)
              .join(", ")}
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl">Ready to print</h2>
            <p className="mt-2 text-[#9ca8a3]">
              Small, useful objects. Swap the MakerWorld links in the catalog for models you
              are licensed to sell.
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((item) => (
            <CatalogCard key={item.slug} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
