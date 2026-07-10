import { beforeEach, describe, expect, it, vi } from "vitest";

const openAIConstructor = vi.fn();

vi.mock("openai", () => ({
  default: class MockOpenAI {
    constructor(options: { apiKey: string }) {
      openAIConstructor(options);
    }
  },
}));

describe("getOpenAIClient", () => {
  beforeEach(() => {
    vi.resetModules();
    openAIConstructor.mockReset();
    delete process.env.OPENAI_API_KEY;
  });

  it("returns null when the key is missing", async () => {
    const { getOpenAIClient } = await import("@/lib/openai/client");
    expect(getOpenAIClient()).toBeNull();
  });

  it("constructs the SDK client when the key is configured", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    const { getOpenAIClient } = await import("@/lib/openai/client");

    getOpenAIClient();

    expect(openAIConstructor).toHaveBeenCalledWith({ apiKey: "test-key" });
  });
});
