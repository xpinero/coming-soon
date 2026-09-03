import { Suspense } from "react";
import { RequestForm } from "@/components/RequestForm";

export const metadata = {
  title: "Special request",
};

export default function RequestPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-5xl text-[#e8f0ec]">
        Special request
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[#9ca8a3]">
        Paste a MakerWorld link or describe the print. I only fulfill models I am allowed to
        sell. Pick an in-stock color for the cheaper per-gram rate, or any other color at
        full price.
      </p>
      <div className="mt-10">
        <Suspense>
          <RequestForm />
        </Suspense>
      </div>
    </div>
  );
}
