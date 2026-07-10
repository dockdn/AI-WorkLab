import type { EvaluationCategory } from "@/types";

export const MINIMUM_PROMPT_LENGTH = 80;
export const MAXIMUM_PROMPT_LENGTH = 5000;

export const EVALUATION_CATEGORIES: ReadonlyArray<{
  id: EvaluationCategory["id"];
  label: string;
}> = [
  { id: "task-clarity", label: "Task Clarity" },
  { id: "relevant-context", label: "Relevant Context" },
  { id: "audience-tone", label: "Audience & Tone" },
  { id: "constraints", label: "Constraints" },
  { id: "output-format", label: "Output Format" },
  { id: "verification-judgment", label: "Verification & Judgment" },
] as const;

export function getMinimumPromptLength() {
  return MINIMUM_PROMPT_LENGTH;
}

export function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}
