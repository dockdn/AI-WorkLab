"use client";

import type { PromptEvaluation } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";
import { CoachingCard } from "@/components/workspace/coaching-card";

export function EvaluationPanel({
  evaluation,
  originalPrompt,
  serverMessage,
  onRevise,
}: {
  evaluation: PromptEvaluation;
  originalPrompt: string;
  serverMessage: string | null;
  onRevise: () => void;
}) {
  return (
    <div className="space-y-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge tone={evaluation.evaluationSource === "openai" ? "default" : "gold"}>
            {evaluation.evaluationSource === "openai" ? "AI-powered feedback" : "Prototype feedback"}
          </Badge>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--color-navy)]">Evaluation results</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-slate)]">{evaluation.summary}</p>
        </div>
        <ScoreRing score={evaluation.overallScore} />
      </div>
      {serverMessage ? (
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-gold-faint)] p-4 text-sm leading-6 text-[var(--color-navy)]">
          {serverMessage}
        </div>
      ) : null}
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-page)] p-4 text-sm leading-6 text-[var(--color-slate)]">
        AI feedback may be incomplete or incorrect. Review all generated content before using it in real work.
      </div>
      <div className="rounded-3xl bg-[var(--color-page)] p-4">
        <div className="text-sm font-semibold text-[var(--color-navy)]">Your submitted prompt</div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--color-slate)]">{originalPrompt}</p>
      </div>
      <CoachingCard title="Strengths" items={evaluation.strengths} />
      <CoachingCard title="Most important improvements" items={evaluation.improvements} />
      <div className="grid gap-3">
        {evaluation.categories.map((category) => (
          <div key={category.id} className="rounded-3xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-[var(--color-navy)]">{category.label}</h3>
              <div className="text-sm font-semibold text-[var(--color-accent-text)]">{category.score}/100</div>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--color-slate)]">{category.explanation}</p>
            <p className="mt-3 text-sm font-medium text-[var(--color-accent-text)]">Next step: {category.nextStep}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-[var(--color-border)] p-4">
        <div className="text-sm font-semibold text-[var(--color-navy)]">Workplace output generated from your prompt</div>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-[var(--color-slate)]">{evaluation.generatedOutput}</pre>
      </div>
      <div className="rounded-3xl border border-[var(--color-border)] p-4">
        <div className="text-sm font-semibold text-[var(--color-navy)]">Improved prompt example</div>
        <p className="mt-3 text-sm leading-6 text-[var(--color-slate)]">{evaluation.improvedPrompt}</p>
      </div>
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-page)] p-4 text-sm leading-6 text-[var(--color-slate)]">
        {evaluation.humanReviewReminder}
      </div>
      <Button variant="secondary" onClick={onRevise}>Revise Prompt</Button>
    </div>
  );
}
