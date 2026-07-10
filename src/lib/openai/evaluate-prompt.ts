import "server-only";
import type OpenAI from "openai";
import type { PromptEvaluation } from "@/types";
import type { CanonicalScenario } from "@/lib/evaluation/scenarios";
import { getOpenAIClient } from "@/lib/openai/client";
import { getOpenAIModel } from "@/lib/openai/config";
import { openAIEvaluationSchema } from "@/lib/openai/schema";

export class OpenAIEvaluationError extends Error {
  readonly kind:
    | "missing_api_key"
    | "invalid_api_key"
    | "invalid_model"
    | "billing_or_quota"
    | "rate_limit"
    | "malformed_response"
    | "network_or_provider_error";
  readonly requestId?: string;
  readonly status?: number;
  readonly code?: string;
  readonly type?: string;
  readonly diagnosticDetails?: SanitizedOpenAIErrorDetails;

  constructor(
    kind: OpenAIEvaluationError["kind"],
    message: string,
    requestId?: string,
    options?: {
      status?: number;
      code?: string;
      type?: string;
      diagnosticDetails?: SanitizedOpenAIErrorDetails;
    },
  ) {
    super(message);
    this.name = "OpenAIEvaluationError";
    this.kind = kind;
    this.requestId = requestId;
    this.status = options?.status;
    this.code = options?.code;
    this.type = options?.type;
    this.diagnosticDetails = options?.diagnosticDetails;
  }
}

type ProviderErrorShape = {
  name?: string;
  _request_id?: string | null;
  status?: number;
  code?: string | null;
  type?: string | null;
  message?: string;
  cause?: {
    name?: string;
    message?: string;
    code?: string;
    errno?: string | number;
    syscall?: string;
    hostname?: string;
  };
  error?: {
    code?: string | null;
    type?: string | null;
    message?: string;
  };
};

export type SanitizedOpenAIErrorDetails = {
  errorName?: string;
  errorConstructorName?: string;
  errorMessage: string;
  status?: number;
  providerCode?: string;
  providerType?: string;
  requestId?: string;
  causeName?: string;
  causeCode?: string;
  causeMessage?: string;
  causeErrno?: string | number;
  causeSyscall?: string;
  causeHostname?: string;
};

function sanitizeErrorMessage(message: string | undefined) {
  if (!message) {
    return "OpenAI evaluation failed.";
  }

  return message.slice(0, 240);
}

export function getSanitizedOpenAIErrorDetails(error: unknown): SanitizedOpenAIErrorDetails {
  const providerError = (typeof error === "object" && error !== null ? error : {}) as ProviderErrorShape;
  const cause = providerError.cause;
  const errorWithConstructor =
    typeof error === "object" && error !== null
      ? (error as { constructor?: { name?: string } })
      : undefined;

  return {
    errorName:
      typeof providerError.name === "string" && providerError.name.length > 0 ? providerError.name : undefined,
    errorConstructorName:
      typeof errorWithConstructor?.constructor?.name === "string"
        ? errorWithConstructor.constructor.name
        : undefined,
    errorMessage: sanitizeErrorMessage(providerError.message ?? providerError.error?.message),
    status: providerError.status,
    providerCode: providerError.code ?? providerError.error?.code ?? undefined,
    providerType: providerError.type ?? providerError.error?.type ?? undefined,
    requestId: providerError._request_id ?? undefined,
    causeName: typeof cause?.name === "string" ? cause.name : undefined,
    causeCode: typeof cause?.code === "string" ? cause.code : undefined,
    causeMessage: sanitizeErrorMessage(cause?.message),
    causeErrno:
      typeof cause?.errno === "string" || typeof cause?.errno === "number" ? cause.errno : undefined,
    causeSyscall: typeof cause?.syscall === "string" ? cause.syscall : undefined,
    causeHostname: typeof cause?.hostname === "string" ? cause.hostname : undefined,
  };
}

function categorizeProviderError(error: ProviderErrorShape) {
  const details = getSanitizedOpenAIErrorDetails(error);
  const status = details.status;
  const code = details.providerCode;
  const type = details.providerType;
  const message = details.errorMessage;
  const requestId = details.requestId;

  if (status === 401 || code === "invalid_api_key") {
    return new OpenAIEvaluationError("invalid_api_key", message, requestId, {
      status,
      code,
      type,
      diagnosticDetails: details,
    });
  }

  if (status === 429 && (code === "insufficient_quota" || type === "insufficient_quota")) {
    return new OpenAIEvaluationError("billing_or_quota", message, requestId, {
      status,
      code,
      type,
      diagnosticDetails: details,
    });
  }

  if (status === 429) {
    return new OpenAIEvaluationError("rate_limit", message, requestId, {
      status,
      code,
      type,
      diagnosticDetails: details,
    });
  }

  if (status === 400 && (code === "model_not_found" || type === "invalid_request_error")) {
    return new OpenAIEvaluationError("invalid_model", message, requestId, {
      status,
      code,
      type,
      diagnosticDetails: details,
    });
  }

  return new OpenAIEvaluationError("network_or_provider_error", message, requestId, {
    status,
    code,
    type,
    diagnosticDetails: details,
  });
}

function buildSystemInstructions(scenario: CanonicalScenario) {
  const details = scenario.importantDetails.map((detail) => `- ${detail.label}: ${detail.value}`).join("\n");
  const rubric = scenario.rubric.considerations.map((item) => `- ${item}`).join("\n");

  return [
    "You are a supportive but honest professional AI-skills coach for workplace prompt practice.",
    "Evaluate only the learner's prompt, never the learner as a person.",
    "Use the scenario details below as the canonical reference.",
    "Reward clear task definition, relevant context, audience and tone guidance, important constraints, useful output formatting, and instructions that acknowledge uncertainty or human review.",
    "Do not inflate scores. Be specific, practical, and concise.",
    "Keep the complete JSON response concise enough to finish within the output-token limit.",
    "Keep each explanation and nextStep to one short sentence.",
    "Keep generatedOutput under 250 words and improvedPrompt under 180 words.",
    "Do not give extra credit merely for phrases like 'act as an expert.'",
    "A concise prompt can still be strong.",
    "Treat requests for an exact date as a weakness when the scenario says the date is unconfirmed.",
    "Never claim the learner's prompt guarantees factual accuracy.",
    "Generate the workplace output from the learner's original prompt, not the improved prompt.",
    "Clearly distinguish prompt coaching from the generated workplace output.",
    "Avoid private information beyond the fictional scenario details already supplied.",
    "Return one valid JSON object and nothing else.",
    "Do not use markdown, code fences, commentary, or prose outside the JSON object.",
    "The JSON object must contain exactly these top-level keys: overallScore, summary, strengths, improvements, categories, improvedPrompt, generatedOutput, humanReviewReminder.",
    "overallScore must be an integer from 0 to 100.",
    "strengths and improvements must each be arrays containing 1 to 4 concise strings.",
    "categories must be an array of exactly six objects in this exact order: Task Clarity, Relevant Context, Audience & Tone, Constraints, Output Format, Verification & Judgment.",
    "Each category object must contain id, label, score, explanation, and nextStep.",
    "Use these exact category ids in order: task-clarity, relevant-context, audience-tone, constraints, output-format, verification-judgment.",
    "Use these exact category labels in order: Task Clarity, Relevant Context, Audience & Tone, Constraints, Output Format, Verification & Judgment.",
    "",
    `Scenario title: ${scenario.title}`,
    `Situation: ${scenario.situation}`,
    `Assignment: ${scenario.assignment}`,
    "Important details:",
    details,
    "Evaluation considerations:",
    rubric,
    `Human review reminder to include: ${scenario.rubric.requiredHumanReview}`,
  ].join("\n");
}

function buildUserMessage(scenario: CanonicalScenario, userPrompt: string) {
  return [
    "Evaluate this learner prompt against the scenario.",
    "",
    `Learner prompt:\n${userPrompt}`,
    "",
    `Workplace output to generate from the learner prompt: ${scenario.rubric.outputDescription}`,
    "",
    "Return only the JSON object described in the system instructions.",
  ].join("\n");
}

export async function evaluatePromptWithOpenAI({
  scenario,
  userPrompt,
  client = getOpenAIClient(),
}: {
  scenario: CanonicalScenario;
  userPrompt: string;
  client?: OpenAI | null;
}): Promise<PromptEvaluation> {
  if (!client) {
    throw new OpenAIEvaluationError("missing_api_key", "OpenAI is not configured.");
  }

  try {
    const response = await client.responses.create({
      model: getOpenAIModel(),
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: buildSystemInstructions(scenario) }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: buildUserMessage(scenario, userPrompt) }],
        },
      ],
      max_output_tokens: 5000,
    });

    const outputText = response.output_text?.trim();

    if (process.env.NODE_ENV !== "production") {
      console.info("[prompt-evaluation] OpenAI response received", {
        requestId: response._request_id ?? undefined,
        outputTextLength: outputText?.length ?? 0,
        responseStatus: response.status,
      });
    }

    if (!outputText) {
      throw new OpenAIEvaluationError(
        "malformed_response",
        "OpenAI returned an empty evaluation response.",
        response._request_id ?? undefined,
        {
          code: "empty_output_text",
          type: "structured_output_missing",
          diagnosticDetails: {
            errorName: "StructuredOutputMissingError",
            errorConstructorName: "OpenAIEvaluationError",
            errorMessage: "OpenAI returned an empty evaluation response.",
            providerCode: "empty_output_text",
            providerType: "structured_output_missing",
            requestId: response._request_id ?? undefined,
          },
        },
      );
    }

    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(outputText);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[prompt-evaluation] JSON parse failed", {
          requestId: response._request_id ?? undefined,
          outputTextLength: outputText.length,
          parseError:
            error instanceof Error ? error.message.slice(0, 240) : "Unknown JSON parse error",
        });
      }
      throw new OpenAIEvaluationError(
        "malformed_response",
        "OpenAI returned invalid JSON for the evaluation response.",
        response._request_id ?? undefined,
        {
          code: "invalid_json",
          type: "structured_output_parse_error",
          diagnosticDetails: {
            errorName: "StructuredOutputParseError",
            errorConstructorName: "OpenAIEvaluationError",
            errorMessage: "OpenAI returned invalid JSON for the evaluation response.",
            providerCode: "invalid_json",
            providerType: "structured_output_parse_error",
            requestId: response._request_id ?? undefined,
          },
        },
      );
    }

    const parsed = openAIEvaluationSchema.safeParse(parsedJson);

    if (!parsed.success) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[prompt-evaluation] Zod validation failed", {
          requestId: response._request_id ?? undefined,
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            code: issue.code,
            message: issue.message,
          })),
        });
      }
      throw new OpenAIEvaluationError(
        "malformed_response",
        "OpenAI returned an invalid evaluation.",
        response._request_id ?? undefined,
        {
          code: "schema_validation_failed",
          type: "application_validation_error",
          diagnosticDetails: {
            errorName: "StructuredOutputValidationError",
            errorConstructorName: "OpenAIEvaluationError",
            errorMessage: "OpenAI returned an invalid evaluation.",
            providerCode: "schema_validation_failed",
            providerType: "application_validation_error",
            requestId: response._request_id ?? undefined,
          },
        },
      );
    }


    return {
      ...parsed.data,
      evaluationSource: "openai",
    };
  } catch (error) {
    if (error instanceof OpenAIEvaluationError) {
      throw error;
    }

    if (typeof error === "object" && error !== null) {
      throw categorizeProviderError(error as ProviderErrorShape);
    }

    throw new OpenAIEvaluationError("network_or_provider_error", "OpenAI evaluation failed.", undefined, {
      diagnosticDetails: {
        errorMessage: "OpenAI evaluation failed.",
      },
    });
  }
}
