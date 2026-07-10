import { describe, expect, it } from "vitest";
import { MAXIMUM_PROMPT_LENGTH, MINIMUM_PROMPT_LENGTH } from "@/lib/evaluation/constants";
import { RequestValidationError, parseEvaluationRequest } from "@/lib/evaluation/validation";

describe("parseEvaluationRequest", () => {
  it("accepts a recognized scenario with a valid prompt length", () => {
    const result = parseEvaluationRequest({
      scenarioId: "construction-client-communication-1",
      userPrompt: "Draft a professional email to the homeowner about the roofing project timing and avoid promising an exact date.",
    });

    expect(result.scenarioId).toBe("construction-client-communication-1");
  });

  it("rejects an unknown scenario", () => {
    expect(() =>
      parseEvaluationRequest({
        scenarioId: "unknown-scenario",
        userPrompt: "x".repeat(MINIMUM_PROMPT_LENGTH),
      }),
    ).toThrowError(RequestValidationError);
  });

  it("rejects prompts below the minimum length", () => {
    expect(() =>
      parseEvaluationRequest({
        scenarioId: "construction-client-communication-1",
        userPrompt: "x".repeat(MINIMUM_PROMPT_LENGTH - 1),
      }),
    ).toThrowError(RequestValidationError);
  });

  it("rejects prompts above the maximum length", () => {
    expect(() =>
      parseEvaluationRequest({
        scenarioId: "construction-client-communication-1",
        userPrompt: "x".repeat(MAXIMUM_PROMPT_LENGTH + 1),
      }),
    ).toThrowError(RequestValidationError);
  });
});
