import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCatalogItem } from "@/data/catalog";
import { quotePrintByColorId } from "@/data/pricing";
import {
  allowedShippingCountries,
  shippingOptionsFor,
} from "@/data/shipping";
import { randomLetterSuffix, siteUrl } from "@/lib/site";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";

type CheckoutBody = {
  type?: "catalog" | "request";
  productSlug?: string;
  colorId?: string;
  quantity?: number;
  grams?: number;
  makerWorldUrl?: string;
  notes?: string;
  source?: string;
};

function isMakerWorldUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "makerworld.com" || url.hostname === "www.makerworld.com")
    );
  } catch {
    return false;
  }
}

function trimNotes(notes: string | undefined): string {
  return (notes || "").trim().slice(0, 400);
}

export async function POST(request: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Checkout is not connected yet. Add a Stripe secret key to the shop environment.",
      },
      { status: 503 },
    );
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const type = body.type === "request" ? "request" : "catalog";
  const colorId = String(body.colorId || "");
  const quantity = Number(body.quantity || 1);
  const notes = trimNotes(body.notes);
  const source = (body.source || "web").slice(0, 32);
  const makerWorldUrl = String(body.makerWorldUrl || "").trim();

  if (makerWorldUrl && !isMakerWorldUrl(makerWorldUrl)) {
    return NextResponse.json(
      { error: "MakerWorld links should start with https://makerworld.com/" },
      { status: 400 },
    );
  }

  let grams: number;
  let productName: string;
  let productSlug = "";

  if (type === "catalog") {
    const item = getCatalogItem(String(body.productSlug || ""));
    if (!item) {
      return NextResponse.json({ error: "That print is not in the catalog." }, { status: 400 });
    }
    grams = item.grams;
    productName = item.name;
    productSlug = item.slug;
  } else {
    grams = Number(body.grams);
    productName = "Special request print";
    if (!makerWorldUrl && !notes) {
      return NextResponse.json(
        { error: "Add a MakerWorld link or describe what you want printed." },
        { status: 400 },
      );
    }
  }

  let quote;
  try {
    quote = quotePrintByColorId(grams, quantity, colorId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not price this print.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const shipping = shippingOptionsFor(quote.totalGrams);
  const origin = siteUrl();
  const stripe = getStripe();

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: quote.printCents,
        product_data: {
          name: `${productName} — ${quote.color.name} ${quote.color.material}`,
          description: `${quote.totalGrams}g at ${quote.perGramCents}¢/g (${quote.color.inStock ? "in stock" : "full price, color not in stock"})`,
        },
      },
    },
  ];

  if (quote.restockFeeCents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: quote.restockFeeCents,
        product_data: {
          name: "Color restock (not in stock)",
          description: `${quote.color.name} is not on the shelf, so this order uses the full commercial rate plus a restock fee.`,
        },
      },
    });
  }

  lineItems.push({
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: quote.handlingFeeCents,
      product_data: {
        name: "Packing & handling",
      },
    },
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order/cancel`,
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: [...allowedShippingCountries],
      },
      shipping_options: shipping.map((option) => ({
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: option.name,
          fixed_amount: { amount: option.amountCents, currency: "usd" },
          delivery_estimate: {
            minimum: { unit: "business_day", value: option.minDays },
            maximum: { unit: "business_day", value: option.maxDays },
          },
        },
      })),
      custom_text: {
        shipping_address: {
          message: "US and Canada for now. I print to order, then ship from my bench.",
        },
      },
      metadata: {
        type,
        productSlug,
        productName,
        colorId: quote.color.id,
        colorName: quote.color.name,
        inStock: String(quote.color.inStock),
        grams: String(quote.grams),
        quantity: String(quote.quantity),
        totalGrams: String(quote.totalGrams),
        makerWorldUrl,
        notes,
        source,
      },
      integration_identifier: `xpprints_${type}_${randomLetterSuffix()}`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout failed", error);
    return NextResponse.json(
      { error: "Could not start checkout. Try again in a moment." },
      { status: 502 },
    );
  }
}
