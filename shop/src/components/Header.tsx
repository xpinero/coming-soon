import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "Prints" },
  { href: "/request", label: "Special request" },
  { href: "/how-it-works", label: "Pricing" },
];

export function Header({ compact = false }: { compact?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0f0d]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-wide text-[#e8f0ec]">
            XP
          </span>
          <span className="text-[#3dd68c]">◈</span>
          {!compact && (
            <span className="hidden text-sm uppercase tracking-[0.2em] text-[#9ca8a3] sm:inline">
              {site.name}
            </span>
          )}
        </Link>
        <nav className="flex items-center gap-4 text-sm text-[#9ca8a3] sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[#3dd68c]"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={site.portfolioUrl}
            className="hidden text-[#5c6b64] transition-colors hover:text-[#e8f0ec] sm:inline"
          >
            Portfolio
          </a>
        </nav>
      </div>
    </header>
  );
}
