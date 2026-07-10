import type { Metadata } from "next";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { IndustryCard } from "@/components/industry-card";
import { industries } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Industries",
};

export default function IndustriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-navy)]">Industries</h1>
          <p className="mt-4 text-base leading-7 text-[var(--color-slate)]">
            Choose the business context you want to practice in. Construction is available now, with additional industry tracks staged for future release.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {industries.map((industry) => (
            <IndustryCard key={industry.id} industry={industry} />
          ))}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
