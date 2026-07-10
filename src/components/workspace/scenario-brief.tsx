import type { ScenarioDetail } from "@/types";
import { Badge } from "@/components/ui/badge";

export function ScenarioBrief({ scenario }: { scenario: ScenarioDetail }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Badge>{scenario.labels.industry}</Badge>
        <Badge tone="gold">{scenario.labels.workshop}</Badge>
      </div>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-navy)]">{scenario.title}</h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-slate)]">{scenario.situation}</p>
      </div>
      <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-slate)]">Assignment</h2>
        <p className="mt-3 text-base leading-7 text-[var(--color-navy)]">{scenario.assignment}</p>
      </div>
      <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-slate)]">Important Details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {scenario.importantDetails.map((detail) => (
            <div key={detail.label} className="rounded-2xl bg-[var(--color-muted)] p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-slate)]">{detail.label}</dt>
              <dd className="mt-2 text-sm leading-6 text-[var(--color-navy)]">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <details className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
        <summary className="cursor-pointer text-sm font-semibold text-[var(--color-navy)]">Optional hints</summary>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-slate)]">
          {scenario.hints.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}
