export const site = {
  name: "XP Prints",
  owner: "Xaver Piñero",
  tagline: "Simple 3D prints, priced by the gram.",
  email: "xaver@xaverpinero.com",
  portfolioUrl: "https://www.xaverpinero.com",
  makerWorldHome: "https://makerworld.com",
} as const;

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function randomLetterSuffix(length = 8): string {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += letters[Math.floor(Math.random() * letters.length)];
  }
  return out;
}
