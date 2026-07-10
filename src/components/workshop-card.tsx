import Link from "next/link";
import { ArrowRight, Clock3, Lock } from "lucide-react";
import type { Workshop } from "@/types";
import { Badge } from "@/components/ui/badge";

export function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const content = (
    <div className="flex h-full flex-col rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-[var(--color-navy)]">{workshop.title}</h3>
          <p className="text-sm leading-6 text-[var(--color-slate)]">{workshop.description}</p>
        </div>
        <Badge tone={workshop.status === "available" ? "gold" : "muted"}>
          {workshop.status === "available" ? "Ready" : "Coming soon"}
        </Badge>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-[var(--color-slate)]">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4" aria-hidden="true" />
          {workshop.estimatedMinutes ? `~${workshop.estimatedMinutes} min` : "Future workshop"}
        </div>
        <div className="flex items-center gap-2 font-medium text-[var(--color-accent-text)]">
          {workshop.status === "available" ? (
            <>
              Open <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" aria-hidden="true" /> Locked
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (workshop.href) {
    return (
      <Link href={workshop.href} className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]">
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
