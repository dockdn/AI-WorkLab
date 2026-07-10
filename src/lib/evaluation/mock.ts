import type { EvaluationCategory, PromptEvaluation } from "@/types";
import { clampScore, EVALUATION_CATEGORIES } from "@/lib/evaluation/constants";
import { getCanonicalScenarioById } from "@/lib/evaluation/scenarios";

type SignalRule = {
  id: string;
  match: (text: string) => boolean;
};

const signalRules: SignalRule[] = [
  { id: "audience", match: (text) => /homeowner|customer|client|jordan/.test(text) },
  { id: "email", match: (text) => /email|message|reply|response/.test(text) },
  { id: "tone", match: (text) => /professional|calm|reassuring|polite/.test(text) },
  { id: "weather", match: (text) => /rain|weather|delay/.test(text) },
  { id: "timing", match: (text) => /august|week of august 10|start period|anticipated/.test(text) },
  { id: "uncertainty", match: (text) => /may shift|several days|uncertain|not confirmed|tentative/.test(text) },
  { id: "constraint", match: (text) => /do not promise|avoid promising|no exact date|don't promise/.test(text) },
  { id: "format", match: (text) => /draft|write|compose|email/.test(text) },
  { id: "review", match: (text) => /review|double-check|confirm before sending|human review/.test(text) },
];

function countSignals(text: string, ids: string[]) {
  return ids.filter((id) => signalRules.find((rule) => rule.id === id)?.match(text)).length;
}

function createCategory(
  category: (typeof EVALUATION_CATEGORIES)[number],
  score: number,
  explanation: string,
  nextStep: string,
): EvaluationCategory {
  return {
    id: category.id,
    label: category.label,
    score: clampScore(score),
    explanation,
    nextStep,
  };
}

export function createMockEvaluation(scenarioId: string, prompt: string): PromptEvaluation {
  const scenario = getCanonicalScenarioById(scenarioId);

  if (!scenario) {
    throw new Error("Cannot create a mock evaluation for an unknown scenario.");
  }

  const normalized = prompt.toLowerCase();
  const lengthBoost = normalized.length >= 180 ? 8 : normalized.length >= 120 ? 4 : 0;
  const referencesExactDate = /exact date|specific date|promise a date/.test(normalized);

  const categories = [
    createCategory(
      EVALUATION_CATEGORIES[0],
      56 + countSignals(normalized, ["format"]) * 18 + lengthBoost,
      countSignals(normalized, ["format"]) > 0
        ? "You clearly ask the AI to draft a response, which helps define the task."
        : "The prompt needs a clearer instruction about what the AI should produce.",
      "State that you want a draft email response the team could review before sending.",
    ),
    createCategory(
      EVALUATION_CATEGORIES[1],
      44 + countSignals(normalized, ["weather", "timing", "uncertainty"]) * 15,
      countSignals(normalized, ["weather", "timing", "uncertainty"]) >= 2
        ? "You included meaningful context about timing and the weather-related scheduling impact."
        : "Important context about the August timing and weather disruption is still thin.",
      "Add the original anticipated start window and the reason scheduling may move.",
    ),
    createCategory(
      EVALUATION_CATEGORIES[2],
      46 + countSignals(normalized, ["audience", "email", "tone"]) * 15,
      countSignals(normalized, ["audience", "email", "tone"]) >= 2
        ? "The prompt gives the AI a better sense of who the message is for and how it should sound."
        : "The audience or tone guidance is not specific enough yet.",
      "Name the homeowner as the audience and ask for a professional, calm, reassuring tone.",
    ),
    createCategory(
      EVALUATION_CATEGORIES[3],
      40 + countSignals(normalized, ["constraint"]) * 28 - (referencesExactDate ? 10 : 0),
      countSignals(normalized, ["constraint"]) > 0
        ? "You set an important boundary by warning against promising an exact date."
        : "The prompt does not clearly protect against overpromising an unconfirmed start date.",
      "Tell the AI not to promise an exact start date while the schedule is still uncertain.",
    ),
    createCategory(
      EVALUATION_CATEGORIES[4],
      50 + countSignals(normalized, ["format", "email"]) * 18,
      countSignals(normalized, ["format", "email"]) >= 2
        ? "You gave the AI a useful format target rather than leaving the output shape vague."
        : "The output format is only partially defined.",
      "Specify that the result should be a concise email the team can review before sending.",
    ),
    createCategory(
      EVALUATION_CATEGORIES[5],
      40 + countSignals(normalized, ["uncertainty", "review"]) * 18,
      countSignals(normalized, ["uncertainty", "review"]) >= 2
        ? "The prompt shows stronger judgment by recognizing uncertainty and review needs."
        : "The prompt could do more to acknowledge uncertainty or ask for review-ready caution.",
      "Add a reminder to avoid assumptions and to review the draft before it is used.",
    ),
  ];

  const overallScore = clampScore(
    categories.reduce((total, category) => total + category.score, 0) / categories.length,
  );

  const strengths = [
    countSignals(normalized, ["format"]) > 0 && "You define the task as a drafting request instead of a vague ask.",
    countSignals(normalized, ["weather", "timing"]) > 0 && "You include scenario details that help the response stay grounded.",
    countSignals(normalized, ["tone", "audience"]) > 0 && "You give the AI better direction on who the message is for and how it should sound.",
    countSignals(normalized, ["constraint"]) > 0 && "You recognize the risk of promising a date that has not been confirmed.",
  ].filter(Boolean) as string[];

  const improvements = [
    countSignals(normalized, ["constraint"]) === 0 && "Tell the AI not to promise an exact start date.",
    countSignals(normalized, ["uncertainty"]) === 0 &&
      "Explain that rain affecting earlier projects may shift the schedule by several days.",
    countSignals(normalized, ["review"]) === 0 && "Add a quick instruction to keep the draft review-ready before sending.",
    countSignals(normalized, ["email"]) === 0 && "Specify that the output should be an email response, not just general wording.",
  ].filter(Boolean) as string[];

  return {
    overallScore,
    summary:
      overallScore >= 85
        ? "This prompt gives the AI strong guidance and handles the main communication risks well."
        : overallScore >= 70
          ? "This is a solid prompt draft. Tightening a few constraints and context details would make it more dependable."
          : "The main task is present, but the AI still needs clearer context, boundaries, and review guidance.",
    strengths: strengths.slice(0, 4).length > 0 ? strengths.slice(0, 4) : ["You are starting to frame the task rather than leaving it completely open-ended."],
    improvements:
      improvements.slice(0, 4).length > 0
        ? improvements.slice(0, 4)
        : ["Clarify the confirmed timing, the uncertainty, and the no-exact-date constraint in one concise instruction."],
    categories,
    improvedPrompt: [
      "Draft a professional email reply to a homeowner named Jordan.",
      "Acknowledge the question about when the roofing project will begin.",
      "Explain that the original anticipated start period was the week of August 10, but rain affecting earlier projects may shift the schedule by several days.",
      "Use a calm and reassuring tone, do not promise an exact start date, and let the customer know an updated schedule will be provided once the schedule is confirmed.",
      "Write the response in email format and keep it review-ready before it is sent.",
    ].join(" "),
    generatedOutput: [
      "Subject: Roofing Project Schedule Update",
      "",
      "Hi Jordan,",
      "",
      "Thank you for checking in about the start of your roofing project. Our original anticipated start window is still the week of August 10. Because recent rain has affected the timing of earlier projects, our schedule may shift by a few days.",
      "",
      "We do not want to promise an exact date until that timing is confirmed. As soon as we have the updated schedule finalized, we will send it to you right away.",
      "",
      "We appreciate your patience and look forward to getting started.",
      "",
      "Best,",
      "The Project Team",
    ].join("\n"),
    humanReviewReminder: scenario.rubric.requiredHumanReview,
    evaluationSource: "mock",
  };
}
