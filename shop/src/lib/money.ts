export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatPerGram(cents: number): string {
  return `${formatUsd(cents)}/g`;
}
