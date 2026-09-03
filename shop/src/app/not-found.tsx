import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-[family-name:var(--font-heading)] text-5xl">Not in the catalog</h1>
      <p className="mt-4 text-[#9ca8a3]">
        That print is not listed. Try the catalog or send a special request.
      </p>
      <Link href="/" className="mt-8 inline-block rounded-full bg-[#3dd68c] px-5 py-3 text-sm font-medium text-[#0a0f0d]">
        Browse prints
      </Link>
    </div>
  );
}
