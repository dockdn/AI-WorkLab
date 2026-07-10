import Link from "next/link";
import { ChevronRight, LockKeyhole } from "lucide-react";
import type { Scenario } from "@/types";
import { Badge } from "@/components/ui/badge";

export function ScenarioCard({ scenario, href }: { scenario: Scenario; href?: string }) {
  const enabled = scenario.status === "active" && href;

  const card = (
    <div className="flex h-full flex-col rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-navy)]">{scenario.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--color-slate)]">{scenario.description}</p>
        </div>
        <Badge tone={enabled ? "default" : "muted"}>
          {enabled ? "Active" : "Upcoming"}
        </Badge>
      </div>
      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[var(--color-accent-text)]">
        {enabled ? (
          <>
            Start scenario <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </>
        ) : (
          <>
            <LockKeyhole className="h-4 w-4" aria-hidden="true" /> Unlocks after Scenario 1
          </>
        )}
      </div>
    </div>
  );

  if (enabled) {
    return (
      <Link href={href} className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]">
        {card}
      </Link>
    );
  }

  return <div aria-disabled="true" className="cursor-not-allowed opacity-85">{card}</div>;
}
