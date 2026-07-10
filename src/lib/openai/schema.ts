import { z } from "zod";

const scoreSchema = z.number().int().min(0).max(100);

function evaluationCategorySchema<
  TId extends
    | "task-clarity"
    | "relevant-context"
    | "audience-tone"
    | "constraints"
    | "output-format"
    | "verification-judgment",
>(id: TId, label: string) {
  return z.object({
    id: z.literal(id),
    label: z.literal(label),
    score: scoreSchema,
    explanation: z.string().trim().min(1).max(400),
    nextStep: z.string().trim().min(1).max(240),
  });
}

export const openAIEvaluationSchema = z.object({
  overallScore: scoreSchema,
  summary: z.string().trim().min(1).max(400),
  strengths: z.array(z.string().trim().min(1).max(220)).min(1).max(4),
  improvements: z.array(z.string().trim().min(1).max(220)).min(1).max(4),
  categories: z.tuple([
    evaluationCategorySchema("task-clarity", "Task Clarity"),
    evaluationCategorySchema("relevant-context", "Relevant Context"),
    evaluationCategorySchema("audience-tone", "Audience & Tone"),
    evaluationCategorySchema("constraints", "Constraints"),
    evaluationCategorySchema("output-format", "Output Format"),
    evaluationCategorySchema("verification-judgment", "Verification & Judgment"),
  ]),
  improvedPrompt: z.string().trim().min(1).max(2400),
  generatedOutput: z.string().trim().min(1).max(2400),
  humanReviewReminder: z.string().trim().min(1).max(240),
});

export const promptEvaluationSchema = openAIEvaluationSchema.extend({
  evaluationSource: z.enum(["openai", "mock"]),
});

export const evaluatePromptResponseSchema = z.object({
  evaluation: promptEvaluationSchema,
  message: z.string().trim().min(1).optional(),
});
