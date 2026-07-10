"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";
import type { EvaluatePromptResponse, PromptEvaluation, UserProgress } from "@/types";
import { defaultProgress, readProgress, writeProgress } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EvaluationPanel } from "@/components/workspace/evaluation-panel";
import { EmptyEvaluationState } from "@/components/workspace/empty-evaluation-state";
import { getMinimumPromptLength } from "@/lib/evaluation/constants";

export function PromptComposer({ scenarioId }: { scenarioId: string }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [evaluation, setEvaluation] = useState<PromptEvaluation | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const submissionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const stored = readProgress();
      setProgress(stored);
      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (submissionTimerRef.current) {
        window.clearTimeout(submissionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    writeProgress(progress);
  }, [isHydrated, progress]);

  const minimumLength = getMinimumPromptLength();
  const characterCount = progress.draftPrompt.length;
  const completionPercent = progress.hasAttempted ? 20 : 0;

  const onSubmit = async () => {
    if (isEvaluating) {
      return;
    }

    if (progress.draftPrompt.trim().length < minimumLength) {
      setError(`Add a bit more direction before testing. Aim for at least ${minimumLength} characters.`);
      return;
    }

    setError(null);
    setServerMessage(null);
    setIsEvaluating(true);

    const controller = new AbortController();
    abortControllerRef.current?.abort();
    abortControllerRef.current = controller;

    submissionTimerRef.current = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/evaluate-prompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scenarioId,
            userPrompt: progress.draftPrompt,
          }),
          signal: controller.signal,
        });

        const payload = (await response.json().catch(() => null)) as EvaluatePromptResponse | { error?: string } | null;

        if (!response.ok) {
          const message =
            payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
              ? payload.error
              : "We couldn’t evaluate your prompt right now. Your draft has been preserved. Please try again.";
          setError(message);
          return;
        }

        if (!payload || typeof payload !== "object" || !("evaluation" in payload) || !payload.evaluation) {
          setError("We couldn’t read the evaluation response. Your draft is still here, so please try again.");
          return;
        }

        setEvaluation(payload.evaluation);
        setServerMessage(typeof payload.message === "string" ? payload.message : null);
        setProgress((current) => ({
          ...current,
          hasAttempted: true,
          latestScore: payload.evaluation.overallScore,
          workshopCompletedScenarios: current.workshopCompletedScenarios.includes(1)
            ? current.workshopCompletedScenarios
            : [...current.workshopCompletedScenarios, 1],
        }));
      } catch (submissionError) {
        if (submissionError instanceof DOMException && submissionError.name === "AbortError") {
          return;
        }

        setError("We couldn’t evaluate your prompt right now. Your draft has been preserved. Please try again.");
      } finally {
        setIsEvaluating(false);
        abortControllerRef.current = null;
        submissionTimerRef.current = null;
      }
    }, 900);
  };

  const onClear = () => {
    setProgress((current) => ({ ...current, draftPrompt: "" }));
    setEvaluation(null);
    setServerMessage(null);
    setError(null);
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <section className="space-y-5">
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[var(--color-slate)]">Workshop progress</div>
              <div className="mt-1 text-xl font-semibold text-[var(--color-navy)]">Scenario 1 of 5</div>
            </div>
            <div className="text-right text-sm text-[var(--color-slate)]">
              <div>Most recent score</div>
              <div className="mt-1 text-lg font-semibold text-[var(--color-navy)]">
                {progress.latestScore ?? "Not scored yet"}
              </div>
            </div>
          </div>
          <div className="mt-5">
            <ProgressBar value={completionPercent} label="Workshop completion" />
          </div>
        </div>
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
          <label htmlFor="prompt" className="text-base font-semibold text-[var(--color-navy)]">
            Write the prompt you would give AI
          </label>
          <p className="mt-2 text-sm leading-6 text-[var(--color-slate)]">
            Tell the assistant what to write, who it is for, what tone to use, and what it must avoid.
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-slate)]">
            For practice, use fictional or anonymized information. Do not enter confidential customer, employee, financial, medical, legal, account, or identifying information.
          </p>
          <textarea
            id="prompt"
            value={progress.draftPrompt}
            onChange={(event) => setProgress((current) => ({ ...current, draftPrompt: event.target.value }))}
            className="mt-4 min-h-72 w-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-page)] px-4 py-4 text-base leading-7 text-[var(--color-navy)] outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[color-mix(in_oklab,var(--color-accent)_18%,white)]"
          />
          <div className="mt-3 flex items-center justify-between gap-4 text-sm text-[var(--color-slate)]">
            <span>{characterCount} characters</span>
            {error ? <span className="font-medium text-[var(--color-alert)]">{error}</span> : null}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={onSubmit} disabled={isEvaluating}>
              {isEvaluating ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Your AI coach is reviewing the prompt against this scenario…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" /> Test My Prompt
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={onClear}>Clear</Button>
          </div>
        </div>
      </section>
      <section className="min-h-full">
        {evaluation ? (
          <EvaluationPanel
            evaluation={evaluation}
            originalPrompt={progress.draftPrompt}
            serverMessage={serverMessage}
            onRevise={() => setEvaluation(null)}
          />
        ) : (
          <EmptyEvaluationState />
        )}
      </section>
    </div>
  );
}
