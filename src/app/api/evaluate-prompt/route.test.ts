import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetEvaluationRateLimiter } from "@/lib/evaluation/rate-limit";

const evaluatePromptWithOpenAIMock = vi.fn();

vi.mock("@/lib/openai/evaluate-prompt", async () => {
  const actual = await vi.importActual<typeof import("@/lib/openai/evaluate-prompt")>("@/lib/openai/evaluate-prompt");
  return {
    ...actual,
    evaluatePromptWithOpenAI: evaluatePromptWithOpenAIMock,
  };
});

function createRequest(body: unknown) {
  return new Request("http://localhost/api/evaluate-prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "127.0.0.1",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/evaluate-prompt", () => {
  beforeEach(() => {
    vi.resetModules();
    resetEvaluationRateLimiter();
    evaluatePromptWithOpenAIMock.mockReset();
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
    process.env.NODE_ENV = "test";
  });

  it("returns a 400 for an unknown scenario", async () => {
    const { POST } = await import("@/app/api/evaluate-prompt/route");
    const response = await POST(
      createRequest({
        scenarioId: "unknown",
        userPrompt: "x".repeat(120),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("returns mock feedback when the key is missing in development-style environments", async () => {
    const { POST } = await import("@/app/api/evaluate-prompt/route");
    const response = await POST(
      createRequest({
        scenarioId: "construction-client-communication-1",
        userPrompt:
          "Draft a professional email to the homeowner about the week of August 10, explain that rain may shift the schedule by several days, do not promise an exact date, and let them know an updated schedule will be provided.",
      }),
    );

    const payload = (await response.json()) as { evaluation: { evaluationSource: string }; message?: string };

    expect(response.status).toBe(200);
    expect(payload.evaluation.evaluationSource).toBe("mock");
    expect(payload.message).toContain("Prototype feedback");
  });

  it("uses the OpenAI path when a key is configured", async () => {
    process.env.OPENAI_API_KEY = "configured-key";
    evaluatePromptWithOpenAIMock.mockResolvedValue({
      overallScore: 86,
      summary: "Strong prompt.",
      strengths: ["Clear task framing."],
      improvements: ["Add a review reminder."],
      categories: [
        { id: "task-clarity", label: "Task Clarity", score: 88, explanation: "Clear ask.", nextStep: "Keep it concise." },
        { id: "relevant-context", label: "Relevant Context", score: 84, explanation: "Useful context.", nextStep: "Mention timing uncertainty." },
        { id: "audience-tone", label: "Audience & Tone", score: 87, explanation: "Good audience fit.", nextStep: "Keep the reassuring tone explicit." },
        { id: "constraints", label: "Constraints", score: 85, explanation: "Important boundary included.", nextStep: "Repeat the no exact date rule." },
        { id: "output-format", label: "Output Format", score: 86, explanation: "Email format is clear.", nextStep: "Say it should be send-ready." },
        { id: "verification-judgment", label: "Verification & Judgment", score: 84, explanation: "Reasonable caution.", nextStep: "Ask for review before use." },
      ],
      improvedPrompt: "Improved prompt text.",
      generatedOutput: "Generated output text.",
      humanReviewReminder: "Review all generated content before using it in real work.",
      evaluationSource: "openai",
    });

    const { POST } = await import("@/app/api/evaluate-prompt/route");
    const response = await POST(
      createRequest({
        scenarioId: "construction-client-communication-1",
        userPrompt:
          "Draft a professional email to the homeowner about the week of August 10, explain that rain may shift the schedule by several days, do not promise an exact date, and let them know an updated schedule will be provided.",
      }),
    );

    const payload = (await response.json()) as { evaluation: { evaluationSource: string } };

    expect(response.status).toBe(200);
    expect(payload.evaluation.evaluationSource).toBe("openai");
    expect(evaluatePromptWithOpenAIMock).toHaveBeenCalledOnce();
  });
});
