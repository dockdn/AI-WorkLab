import nextEnv from "@next/env";
import OpenAI from "openai";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

function sanitizeErrorMessage(message) {
  if (typeof message !== "string" || message.length === 0) {
    return "OpenAI connection test failed.";
  }

  return message.slice(0, 240);
}

function getSanitizedErrorDetails(error) {
  const providerError = typeof error === "object" && error !== null ? error : {};
  const cause =
    "cause" in providerError && typeof providerError.cause === "object" && providerError.cause !== null
      ? providerError.cause
      : undefined;

  return {
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY?.trim()),
    hasConfiguredModel: Boolean(process.env.OPENAI_MODEL?.trim()),
    errorName: typeof providerError.name === "string" ? providerError.name : undefined,
    errorConstructorName:
      typeof providerError.constructor === "function" && typeof providerError.constructor.name === "string"
        ? providerError.constructor.name
        : undefined,
    errorMessage: sanitizeErrorMessage(
      providerError.message ?? (providerError.error && providerError.error.message),
    ),
    status: typeof providerError.status === "number" ? providerError.status : undefined,
    providerCode:
      typeof providerError.code === "string"
        ? providerError.code
        : typeof providerError.error?.code === "string"
          ? providerError.error.code
          : undefined,
    providerType:
      typeof providerError.type === "string"
        ? providerError.type
        : typeof providerError.error?.type === "string"
          ? providerError.error.type
          : undefined,
    requestId: typeof providerError._request_id === "string" ? providerError._request_id : undefined,
    causeName: typeof cause?.name === "string" ? cause.name : undefined,
    causeCode: typeof cause?.code === "string" ? cause.code : undefined,
    causeMessage: sanitizeErrorMessage(typeof cause?.message === "string" ? cause.message : undefined),
    causeErrno:
      typeof cause?.errno === "string" || typeof cause?.errno === "number" ? cause.errno : undefined,
    causeSyscall: typeof cause?.syscall === "string" ? cause.syscall : undefined,
    causeHostname: typeof cause?.hostname === "string" ? cause.hostname : undefined,
  };
}

async function main() {
  const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY?.trim());
  const hasConfiguredModel = Boolean(process.env.OPENAI_MODEL?.trim());

  console.log(
    JSON.stringify(
      {
        hasOpenAIKey,
        hasConfiguredModel,
      },
      null,
      2,
    ),
  );

  if (!hasOpenAIKey || !hasConfiguredModel) {
    console.log(
      JSON.stringify(
        {
          success: false,
          message: "OPENAI_API_KEY and OPENAI_MODEL must both be configured for this diagnostic test.",
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL,
      input: "Reply with OK.",
      max_output_tokens: 16,
    });

    console.log(
      JSON.stringify(
        {
          success: true,
          text: typeof response.output_text === "string" ? response.output_text.slice(0, 120) : null,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.log(
      JSON.stringify(
        {
          success: false,
          ...getSanitizedErrorDetails(error),
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }
}

await main();
