import "server-only";

export const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
}

export function isOpenAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function isDevelopmentEnvironment() {
  return process.env.NODE_ENV !== "production";
}
