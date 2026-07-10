import { z } from "zod";
import type { EvaluatePromptRequest } from "@/types";
import { MAXIMUM_PROMPT_LENGTH, MINIMUM_PROMPT_LENGTH } from "@/lib/evaluation/constants";
import { getCanonicalScenarioById } from "@/lib/evaluation/scenarios";

export class RequestValidationError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "RequestValidationError";
    this.statusCode = statusCode;
  }
}

const evaluatePromptRequestSchema = z.object({
  scenarioId: z.string().trim().min(1, "A valid scenarioId is required."),
  userPrompt: z.string(),
});

export function parseEvaluationRequest(input: unknown): EvaluatePromptRequest {
  const parsed = evaluatePromptRequestSchema.safeParse(input);

  if (!parsed.success) {
    throw new RequestValidationError("Please submit a valid scenario and prompt.");
  }

  const scenario = getCanonicalScenarioById(parsed.data.scenarioId);

  if (!scenario) {
    throw new RequestValidationError("That practice scenario is not recognized.");
  }

  const trimmedPrompt = parsed.data.userPrompt.trim();

  if (trimmedPrompt.length < MINIMUM_PROMPT_LENGTH) {
    throw new RequestValidationError(
      `Add more direction before submitting. Prompts must be at least ${MINIMUM_PROMPT_LENGTH} characters.`,
    );
  }

  if (trimmedPrompt.length > MAXIMUM_PROMPT_LENGTH) {
    throw new RequestValidationError(
      `Prompts must be ${MAXIMUM_PROMPT_LENGTH} characters or fewer for this prototype.`,
    );
  }

  return {
    scenarioId: parsed.data.scenarioId,
    userPrompt: trimmedPrompt,
  };
}
