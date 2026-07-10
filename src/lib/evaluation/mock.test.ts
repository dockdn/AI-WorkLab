import { describe, expect, it } from "vitest";
import { createMockEvaluation } from "@/lib/evaluation/mock";

describe("createMockEvaluation", () => {
  it("returns the expected output shape with ordered categories", () => {
    const evaluation = createMockEvaluation(
      "construction-client-communication-1",
      "Draft a professional email to the homeowner about the roofing start timing. Mention the week of August 10, explain that rain has affected earlier projects and may shift the schedule by several days, do not promise an exact start date, and remind the team to review before sending.",
    );

    expect(evaluation.evaluationSource).toBe("mock");
    expect(evaluation.strengths.length).toBeGreaterThan(0);
    expect(evaluation.improvements.length).toBeGreaterThan(0);
    expect(evaluation.categories.map((category) => category.id)).toEqual([
      "task-clarity",
      "relevant-context",
      "audience-tone",
      "constraints",
      "output-format",
      "verification-judgment",
    ]);
  });

  it("keeps all scores within bounds", () => {
    const evaluation = createMockEvaluation(
      "construction-client-communication-1",
      "Write something back to the customer about the roof project.",
    );

    expect(evaluation.overallScore).toBeGreaterThanOrEqual(0);
    expect(evaluation.overallScore).toBeLessThanOrEqual(100);
    expect(evaluation.categories.every((category) => category.score >= 0 && category.score <= 100)).toBe(true);
  });
});
