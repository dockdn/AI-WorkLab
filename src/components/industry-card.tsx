import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import type { Industry } from "@/types";
import { Badge } from "@/components/ui/badge";

export function IndustryCard({ industry }: { industry: Industry }) {
  const content = (
    <div className="flex h-full flex-col rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-[var(--color-navy)]">{industry.name}</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--color-slate)]">{industry.description}</p>
        </div>
        <Badge tone={industry.status === "available" ? "default" : "muted"}>
          {industry.status === "available" ? "Available" : "Coming soon"}
        </Badge>
      </div>
      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[var(--color-accent-text)]">
        {industry.status === "available" ? (
          <>
            Explore industry <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" aria-hidden="true" /> Future release
          </>
        )}
      </div>
    </div>
  );

  if (industry.href) {
    return (
      <Link href={industry.href} className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]">
        {content}
      </Link>
    );
  }

  return (
    <div aria-disabled="true" className="cursor-not-allowed opacity-85">
      {content}
    </div>
  );
}
