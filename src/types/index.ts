export interface Skill {
  id: string;
  title: string;
  description: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: "available" | "coming-soon";
  href?: string;
}

export interface Workshop {
  id: string;
  industryId: string;
  title: string;
  slug: string;
  description: string;
  status: "available" | "coming-soon";
  skills: string[];
  estimatedMinutes?: number;
  href?: string;
}

export interface Scenario {
  id: string;
  canonicalId: string;
  workshopId: string;
  title: string;
  description: string;
  status: "active" | "locked" | "upcoming";
}

export interface ScenarioDetail extends Scenario {
  labels: {
    workshop: string;
    industry: string;
  };
  situation: string;
  assignment: string;
  importantDetails: Array<{
    label: string;
    value: string;
  }>;
  hints: string[];
  privacyNotice: string;
}

export interface EvaluationCategory {
  id:
    | "task-clarity"
    | "relevant-context"
    | "audience-tone"
    | "constraints"
    | "output-format"
    | "verification-judgment";
  label: string;
  score: number;
  explanation: string;
  nextStep: string;
}

export interface PromptEvaluation {
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  improvedPrompt: string;
  generatedOutput: string;
  humanReviewReminder: string;
  evaluationSource: "openai" | "mock";
  categories: EvaluationCategory[];
}

export interface EvaluatePromptRequest {
  scenarioId: string;
  userPrompt: string;
}

export interface EvaluatePromptResponse {
  evaluation: PromptEvaluation;
  message?: string;
}

export interface UserProgress {
  draftPrompt: string;
  hasAttempted: boolean;
  latestScore: number | null;
  workshopCompletedScenarios: number[];
}
