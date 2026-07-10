import { FileText, Sparkles } from "lucide-react";

export function EmptyEvaluationState() {
  return (
    <div className="grid h-full min-h-[28rem] place-items-center rounded-[2rem] border border-dashed border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--shadow-card)]">
      <div className="max-w-md">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--color-muted)]">
          <Sparkles className="h-7 w-7 text-[var(--color-accent)]" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-[var(--color-navy)]">Test your prompt when you are ready</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--color-slate)]">
          After submission, this workspace will show generated workplace output, category scores, coaching, and a stronger prompt example.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-page)] px-4 py-2 text-sm text-[var(--color-slate)]">
          <FileText className="h-4 w-4" aria-hidden="true" /> Prototype feedback appears here
        </div>
      </div>
    </div>
  );
}
