import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 px-4 py-10 text-sm text-[#5c6b64]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {site.name} · printed by {site.owner}
        </p>
        <p>
          Questions?{" "}
          <a className="text-[#9ca8a3] hover:text-[#3dd68c]" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </p>
      </div>
    </footer>
  );
}
