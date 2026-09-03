export type CatalogItem = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  grams: number;
  category: string;
  /** MakerWorld model you have a commercial license to print. */
  makerWorldUrl: string;
  accent: string;
};

/**
 * Swap these placeholders for models you are licensed to sell.
 * Only list MakerWorld models with a commercial license (or your own designs).
 */
export const catalog: CatalogItem[] = [
  {
    slug: "trail-clip",
    name: "Trail Gear Clip",
    summary: "A stout clip for cables, hydration tubes, or tent lines.",
    description:
      "Printed solid enough for daily use. Default size is a small utility clip — tell me in special requests if you need a different scale.",
    grams: 12,
    category: "Utility",
    makerWorldUrl: "",
    accent: "#3dd68c",
  },
  {
    slug: "cable-comb",
    name: "Desk Cable Comb",
    summary: "Keeps a handful of cables in a straight, tidy row.",
    description:
      "A compact comb for a desk or nightstand. Best in an in-stock color so it ships faster.",
    grams: 18,
    category: "Desk",
    makerWorldUrl: "",
    accent: "#2dd4bf",
  },
  {
    slug: "ridge-stand",
    name: "Ridge Phone Stand",
    summary: "A simple angled stand for a phone or small tablet.",
    description:
      "Wide base, no moving parts. Printed with enough infill to sit still on a desk or dashboard.",
    grams: 35,
    category: "Desk",
    makerWorldUrl: "",
    accent: "#a855f7",
  },
  {
    slug: "headphone-hook",
    name: "Headphone Hook",
    summary: "A clamp-on hook for the edge of a desk or shelf.",
    description:
      "Holds a pair of headphones without drilling. Clamp opening fits a typical desk lip.",
    grams: 28,
    category: "Desk",
    makerWorldUrl: "",
    accent: "#f97316",
  },
  {
    slug: "mini-planter",
    name: "Mini Planter",
    summary: "A small pot for a succulent or desk plant.",
    description:
      "Drainage hole included. Not food-safe. Soil and plant are not included.",
    grams: 45,
    category: "Home",
    makerWorldUrl: "",
    accent: "#fbbf24",
  },
  {
    slug: "sd-wallet",
    name: "SD Card Wallet",
    summary: "A pocket case for SD and microSD cards.",
    description:
      "Snap-fit lid. A practical print that shows off silk or solid colors equally well.",
    grams: 22,
    category: "Utility",
    makerWorldUrl: "",
    accent: "#ec4899",
  },
];

export function getCatalogItem(slug: string): CatalogItem | undefined {
  return catalog.find((item) => item.slug === slug);
}
