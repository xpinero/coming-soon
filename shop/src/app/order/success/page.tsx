import Link from "next/link";
import { formatUsd } from "@/lib/money";
import { stripeConfigured, getStripe } from "@/lib/stripe";

export const metadata = {
  title: "Order received",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  let amount = "";
  let email = "";
  let productName = "your print";

  if (sessionId && stripeConfigured()) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      if (typeof session.amount_total === "number") {
        amount = formatUsd(session.amount_total);
      }
      email = session.customer_details?.email || "";
      productName = session.metadata?.productName || productName;
    } catch {
      // The page still works if Stripe lookup fails.
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-[#3dd68c]">Paid</p>
      <h1 className="mt-4 font-[family-name:var(--font-heading)] text-5xl">Order received</h1>
      <p className="mt-5 text-lg leading-relaxed text-[#9ca8a3]">
        {productName} is in the queue
        {amount ? ` · ${amount}` : ""}.
        {email ? ` A receipt is on the way to ${email}.` : ""} I will print and ship after
        I confirm the model and color.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-[#3dd68c] px-5 py-3 text-sm font-medium text-[#0a0f0d]"
      >
        Back to the shop
      </Link>
    </div>
  );
}
