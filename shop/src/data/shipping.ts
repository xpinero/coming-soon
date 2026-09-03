export type ShippingOption = {
  id: string;
  name: string;
  amountCents: number;
  minDays: number;
  maxDays: number;
};

/**
 * Simple weight-tiered US shipping. Edit amounts to match what you actually pay.
 * Stripe Checkout lets the customer pick among the options we send.
 */
export function shippingOptionsFor(totalGrams: number): ShippingOption[] {
  const groundCents =
    totalGrams <= 100 ? 550 : totalGrams <= 350 ? 850 : 1250;
  const priorityCents = groundCents + 700;

  return [
    {
      id: "ground",
      name: "USPS Ground",
      amountCents: groundCents,
      minDays: 5,
      maxDays: 9,
    },
    {
      id: "priority",
      name: "USPS Priority",
      amountCents: priorityCents,
      minDays: 2,
      maxDays: 4,
    },
  ];
}

export const allowedShippingCountries = ["US", "CA"] as const;
