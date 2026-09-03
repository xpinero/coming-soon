"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { filamentColors } from "@/data/inventory";
import { pricing, quotePrint } from "@/data/pricing";
import { ColorSwatches } from "./ColorSwatches";
import { PriceSummary } from "./PriceSummary";

const sizes = [
  { id: "small", label: "Small", grams: 20 },
  { id: "medium", label: "Medium", grams: 50 },
  { id: "large", label: "Large", grams: 120 },
  { id: "xl", label: "XL", grams: 250 },
  { id: "custom", label: "Custom grams", grams: 0 },
] as const;

export function RequestForm() {
  const searchParams = useSearchParams();
  const source = searchParams.get("src") || "web";
  const defaultColor = filamentColors.find((color) => color.inStock) ?? filamentColors[0];
  const [color, setColor] = useState(defaultColor);
  const [sizeId, setSizeId] = useState<(typeof sizes)[number]["id"]>("medium");
  const [customGrams, setCustomGrams] = useState(80);
  const [quantity, setQuantity] = useState(1);
  const [makerWorldUrl, setMakerWorldUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const grams =
    sizeId === "custom"
      ? Math.min(pricing.maxGrams, Math.max(pricing.minGrams, customGrams))
      : sizes.find((size) => size.id === sizeId)!.grams;

  const quote = useMemo(
    () => quotePrint({ grams, quantity, color }),
    [grams, quantity, color],
  );

  async function checkout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "request",
          colorId: color.id,
          quantity,
          grams,
          makerWorldUrl,
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
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.18em] text-[#5c6b64]">
            MakerWorld link
          </span>
          <input
            type="url"
            value={makerWorldUrl}
            onChange={(event) => setMakerWorldUrl(event.target.value)}
            placeholder="https://makerworld.com/en/models/..."
            className="w-full rounded-xl border border-white/10 bg-[#121a16] px-3 py-2 text-[#e8f0ec] placeholder:text-[#5c6b64]"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.18em] text-[#5c6b64]">
            What should I print?
          </span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            required={!makerWorldUrl}
            rows={5}
            placeholder="Model name, scale, and any details. I only print models I am allowed to sell."
            className="w-full rounded-xl border border-white/10 bg-[#121a16] px-3 py-2 text-[#e8f0ec] placeholder:text-[#5c6b64]"
          />
        </label>
        <fieldset className="space-y-3">
          <legend className="text-xs uppercase tracking-[0.18em] text-[#5c6b64]">
            Estimated size
          </legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => setSizeId(size.id)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  sizeId === size.id
                    ? "border-[#3dd68c] bg-[#3dd68c]/10 text-[#e8f0ec]"
                    : "border-white/10 text-[#9ca8a3]"
                }`}
              >
                {size.label}
                {size.grams ? ` · ${size.grams}g` : ""}
              </button>
            ))}
          </div>
          {sizeId === "custom" && (
            <input
              type="number"
              min={pricing.minGrams}
              max={pricing.maxGrams}
              value={customGrams}
              onChange={(event) => setCustomGrams(Number(event.target.value) || pricing.minGrams)}
              className="w-32 rounded-xl border border-white/10 bg-[#121a16] px-3 py-2 text-[#e8f0ec]"
            />
          )}
        </fieldset>
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
        <ColorSwatches value={color.id} onChange={setColor} />
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
          {busy ? "Starting checkout…" : "Pay for this request"}
        </button>
        <p className="text-xs leading-relaxed text-[#5c6b64]">
          If the model is not something I can print, I will refund before starting. Weight is an
          estimate — I will message you if the finished print is far off.
        </p>
      </div>
    </form>
  );
}
