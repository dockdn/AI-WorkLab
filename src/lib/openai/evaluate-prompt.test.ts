import { describe, expect, it } from "vitest";
import { getCanonicalScenarioById } from "@/lib/evaluation/scenarios";
import { evaluatePromptWithOpenAI, OpenAIEvaluationError } from "@/lib/openai/evaluate-prompt";

const validStructuredOutput = JSON.stringify({
  overallScore: 88,
  summary: "Strong prompt with a few small gaps.",
  strengths: ["Clear task framing."],
  improvements: ["Add a stronger review reminder."],
  categories: [
    { id: "task-clarity", label: "Task Clarity", score: 90, explanation: "Clear ask.", nextStep: "Keep it concise." },
    {
      id: "relevant-context",
      label: "Relevant Context",
      score: 86,
      explanation: "Useful schedule context.",
      nextStep: "Keep the timing details explicit.",
    },
    {
      id: "audience-tone",
      label: "Audience & Tone",
      score: 89,
      explanation: "Appropriate audience and tone direction.",
      nextStep: "Name the reassuring tone directly.",
    },
    {
      id: "constraints",
      label: "Constraints",
      score: 84,
      explanation: "Good boundary around the date.",
      nextStep: "Repeat the no exact date constraint.",
    },
    {
      id: "output-format",
      label: "Output Format",
      score: 87,
      explanation: "Email format is clear.",
      nextStep: "Mention that it should be review-ready.",
    },
    {
      id: "verification-judgment",
      label: "Verification & Judgment",
      score: 82,
      explanation: "Reasonable caution is present.",
      nextStep: "Add a final review instruction.",
    },
  ],
  improvedPrompt: "Improved prompt text.",
  generatedOutput: "Generated output text.",
  humanReviewReminder: "Review all generated content before using it in real work.",
});

describe("evaluatePromptWithOpenAI", () => {
  it("returns a validated evaluation for valid JSON output", async () => {
    const scenario = getCanonicalScenarioById("construction-client-communication-1");

    const result = await evaluatePromptWithOpenAI({
      scenario: scenario!,
      userPrompt:
        "Draft a professional email to the customer about the weather-related timing change and avoid promising an exact date.",
      client: {
        responses: {
          create: async () => ({
            output_text: validStructuredOutput,
            _request_id: "req_valid",
          }),
        },
      } as never,
    });

    expect(result.evaluationSource).toBe("openai");
    expect(result.overallScore).toBe(88);
  });

  it("throws a malformed response error for invalid JSON output", async () => {
    const scenario = getCanonicalScenarioById("construction-client-communication-1");

    await expect(
      evaluatePromptWithOpenAI({
        scenario: scenario!,
        userPrompt:
          "Draft a professional email to the customer about the weather-related timing change and avoid promising an exact date.",
        client: {
          responses: {
            create: async () => ({
              output_text: "{not-json",
              _request_id: "req_invalid_json",
            }),
          },
        } as never,
      }),
    ).rejects.toMatchObject<Partial<OpenAIEvaluationError>>({
      kind: "malformed_response",
      code: "invalid_json",
      type: "structured_output_parse_error",
      requestId: "req_invalid_json",
    });
  });

  it("throws a malformed response error for valid JSON that fails Zod validation", async () => {
    const scenario = getCanonicalScenarioById("construction-client-communication-1");

    await expect(
      evaluatePromptWithOpenAI({
        scenario: scenario!,
        userPrompt:
          "Draft a professional email to the customer about the weather-related timing change and avoid promising an exact date.",
        client: {
          responses: {
            create: async () => ({
              output_text: JSON.stringify({
                overallScore: 88,
              }),
              _request_id: "req_schema_fail",
            }),
          },
        } as never,
      }),
    ).rejects.toMatchObject<Partial<OpenAIEvaluationError>>({
      kind: "malformed_response",
      code: "schema_validation_failed",
      type: "application_validation_error",
      requestId: "req_schema_fail",
    });
  });

  it("throws a malformed response error when output_text is empty", async () => {
    const scenario = getCanonicalScenarioById("construction-client-communication-1");

    await expect(
      evaluatePromptWithOpenAI({
        scenario: scenario!,
        userPrompt:
          "Draft a professional email to the customer about the weather-related timing change and avoid promising an exact date.",
        client: {
          responses: {
            create: async () => ({
              output_text: "   ",
              _request_id: "req_empty",
            }),
          },
        } as never,
      }),
    ).rejects.toMatchObject<Partial<OpenAIEvaluationError>>({
      kind: "malformed_response",
      code: "empty_output_text",
      type: "structured_output_missing",
      requestId: "req_empty",
    });
  });
});
