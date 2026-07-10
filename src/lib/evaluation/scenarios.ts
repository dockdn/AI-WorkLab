import { scenarioOneDetail } from "@/data/catalog";

export interface CanonicalScenario {
  id: string;
  title: string;
  assignment: string;
  situation: string;
  importantDetails: Array<{
    label: string;
    value: string;
  }>;
  rubric: {
    strengthsToReward: string[];
    considerations: string[];
    requiredHumanReview: string;
    outputDescription: string;
  };
}

const canonicalScenarios: Record<string, CanonicalScenario> = {
  [scenarioOneDetail.canonicalId]: {
    id: scenarioOneDetail.canonicalId,
    title: scenarioOneDetail.title,
    assignment: scenarioOneDetail.assignment,
    situation: scenarioOneDetail.situation,
    importantDetails: scenarioOneDetail.importantDetails,
    rubric: {
      strengthsToReward: [
        "Clear task definition for drafting a response email",
        "Relevant context from the roofing scheduling situation",
        "Audience and tone guidance appropriate for a homeowner",
        "Constraints that avoid promising an exact unconfirmed date",
        "Instructions to provide an email or send-ready response format",
        "Verification or human-review language around uncertain scheduling",
      ],
      considerations: [
        "The task is to draft an email response.",
        "The audience is a homeowner or customer.",
        "The tone should be professional, calm, and reassuring.",
        "The anticipated start period was the week of August 10.",
        "Weather has affected earlier projects.",
        "Scheduling may shift by several days.",
        "No exact start date should be promised.",
        "The customer should be told that an updated schedule will be provided.",
        "The final response should be reviewed before being sent.",
      ],
      requiredHumanReview:
        "Review all generated content before using it in real work, especially where scheduling details are still unconfirmed.",
      outputDescription: "A professional customer email about the roofing project start window.",
    },
  },
};

export function getCanonicalScenarioById(scenarioId: string) {
  return canonicalScenarios[scenarioId] ?? null;
}
