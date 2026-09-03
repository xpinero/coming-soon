"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CatalogItem } from "@/data/catalog";
import { filamentColors } from "@/data/inventory";
import { pricing, quotePrint } from "@/data/pricing";
import { ColorSwatches } from "./ColorSwatches";
import { PriceSummary } from "./PriceSummary";

export function PrintForm({ item }: { item: CatalogItem }) {
  const searchParams = useSearchParams();
  const source = searchParams.get("src") || "web";
  const defaultColor = filamentColors.find((color) => color.inStock) ?? filamentColors[0];
  const [color, setColor] = useState(defaultColor);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const quote = useMemo(
    () => quotePrint({ grams: item.grams, quantity, color }),
    [item.grams, quantity, color],
  );

  async function checkout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "catalog",
          productSlug: item.slug,
          colorId: color.id,
          quantity,
          notes,
          source,
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout is unavailable right now.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setBusy(false);
    }
  }

  return (
    <form
      className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
      onSubmit={(event) => {
        event.preventDefault();
        void checkout();
      }}
    >
      <div className="space-y-8">
        <ColorSwatches value={color.id} onChange={setColor} />
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.18em] text-[#5c6b64]">Quantity</span>
          <input
            type="number"
            min={1}
            max={pricing.maxQuantity}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value) || 1)}
            className="w-28 rounded-xl border border-white/10 bg-[#121a16] px-3 py-2 text-[#e8f0ec]"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.18em] text-[#5c6b64]">
            Notes for this print
          </span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            placeholder="Scale, infill, or anything else I should know."
            className="w-full rounded-xl border border-white/10 bg-[#121a16] px-3 py-2 text-[#e8f0ec] placeholder:text-[#5c6b64]"
          />
        </label>
      </div>
      <div className="space-y-4 lg:sticky lg:top-24">
        <PriceSummary quote={quote} />
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-[#3dd68c] px-5 py-3 font-medium text-[#0a0f0d] transition hover:bg-[#2dd4bf] disabled:opacity-60"
        >
          {busy ? "Starting checkout…" : "Checkout with shipping"}
        </button>
        <p className="text-xs text-[#5c6b64]">
          Stripe collects payment, address, and shipping method on the next screen.
        </p>
      </div>
    </form>
  );
}
