import Link from "next/link";

export const metadata = {
  title: "Checkout canceled",
};

export default function CancelPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-[family-name:var(--font-heading)] text-5xl">Checkout canceled</h1>
      <p className="mt-5 text-lg text-[#9ca8a3]">
        Nothing was charged. The print is still available if you want to try again.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-[#3dd68c] px-5 py-3 text-sm font-medium text-[#0a0f0d]"
      >
        Return to prints
      </Link>
    </div>
  );
}
