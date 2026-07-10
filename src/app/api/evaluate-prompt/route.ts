import { NextResponse } from "next/server";
import { createMockEvaluation } from "@/lib/evaluation/mock";
import { getRateLimitKey, evaluateRateLimit } from "@/lib/evaluation/rate-limit";
import { getCanonicalScenarioById } from "@/lib/evaluation/scenarios";
import { RequestValidationError, parseEvaluationRequest } from "@/lib/evaluation/validation";
import { isDevelopmentEnvironment, isOpenAIConfigured } from "@/lib/openai/config";
import {
  evaluatePromptWithOpenAI,
  getSanitizedOpenAIErrorDetails,
  OpenAIEvaluationError,
} from "@/lib/openai/evaluate-prompt";
import { evaluatePromptResponseSchema } from "@/lib/openai/schema";

function createEnvironmentDiagnostics() {
  return {
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY?.trim()),
    hasConfiguredModel: Boolean(process.env.OPENAI_MODEL?.trim()),
  };
}

function logEvaluationDiagnostics(
  details:
    | {
        evaluationMode: "mock-missing-config" | "mock-fallback-after-openai-error" | "openai";
      }
    | {
        evaluationMode: "openai-error";
        status?: number;
        code?: string;
        type?: string;
        message: string;
      },
) {
  if (!isDevelopmentEnvironment()) {
    return;
  }

  console.log("[prompt-evaluation]", {
    ...createEnvironmentDiagnostics(),
    ...details,
  });
}

function createSuccessResponse(evaluation: unknown, message?: string) {
  const payload = evaluatePromptResponseSchema.parse({
    evaluation,
    message,
  });

  return NextResponse.json(payload, { status: 200 });
}

export async function POST(request: Request) {
  const rateLimit = evaluateRateLimit(getRateLimitKey(request));

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "You have reached the evaluation limit for the moment. Please wait a minute and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  try {
    const body = (await request.json().catch(() => null)) as unknown;
    const parsedRequest = parseEvaluationRequest(body);
    const scenario = getCanonicalScenarioById(parsedRequest.scenarioId);

    if (!scenario) {
      return NextResponse.json({ error: "That practice scenario is not recognized." }, { status: 400 });
    }

    if (!isOpenAIConfigured()) {
      logEvaluationDiagnostics({ evaluationMode: "mock-missing-config" });

      if (!isDevelopmentEnvironment()) {
        return NextResponse.json(
          { error: "Prompt evaluation is not configured on this deployment yet." },
          { status: 503 },
        );
      }

      return createSuccessResponse(
        createMockEvaluation(parsedRequest.scenarioId, parsedRequest.userPrompt),
        "Prototype feedback is active because no OpenAI API key is configured in local development.",
      );
    }

    try {
      const evaluation = await evaluatePromptWithOpenAI({
        scenario,
        userPrompt: parsedRequest.userPrompt,
      });

      logEvaluationDiagnostics({ evaluationMode: "openai" });
      return createSuccessResponse(evaluation);
    } catch (error) {
      if (error instanceof OpenAIEvaluationError) {
        const sanitizedDetails = error.diagnosticDetails ?? getSanitizedOpenAIErrorDetails(error);

        logEvaluationDiagnostics({
          evaluationMode: "openai-error",
          status: sanitizedDetails.status,
          code: sanitizedDetails.providerCode,
          type: sanitizedDetails.providerType,
          message: sanitizedDetails.errorMessage,
        });

        if (isDevelopmentEnvironment()) {
          console.log("[prompt-evaluation]", sanitizedDetails);
        }

        if (isDevelopmentEnvironment()) {
          logEvaluationDiagnostics({ evaluationMode: "mock-fallback-after-openai-error" });

          return createSuccessResponse(
            createMockEvaluation(parsedRequest.scenarioId, parsedRequest.userPrompt),
            "Prototype feedback is active because the live AI evaluation is unavailable in development right now.",
          );
        }

        console.error("[prompt-evaluation]", {
          kind: error.kind,
          requestId: error.requestId ?? null,
          status: error.status ?? null,
          code: error.code ?? null,
          type: error.type ?? null,
        });

        return NextResponse.json(
          { error: "We couldn’t evaluate your prompt right now. Your draft has been preserved. Please try again." },
          { status: 502 },
        );
      }

      throw error;
    }
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    console.error("[prompt-evaluation]", { kind: "unexpected_error" });
    return NextResponse.json(
      { error: "We couldn’t evaluate your prompt right now. Your draft has been preserved. Please try again." },
      { status: 500 },
    );
  }
}
