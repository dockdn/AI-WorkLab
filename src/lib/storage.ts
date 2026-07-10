import type { UserProgress } from "@/types";

export const STORAGE_KEY = "ai-worklab:construction-client-communication-scenario-1";

export const defaultProgress: UserProgress = {
  draftPrompt: "",
  hasAttempted: false,
  latestScore: null,
  workshopCompletedScenarios: [],
};

export function readProgress(): UserProgress {
  if (typeof window === "undefined") {
    return defaultProgress;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaultProgress;
    }

    return { ...defaultProgress, ...JSON.parse(raw) } as UserProgress;
  } catch {
    return defaultProgress;
  }
}

export function writeProgress(progress: UserProgress) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
