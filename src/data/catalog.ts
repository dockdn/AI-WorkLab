import type { Industry, Scenario, ScenarioDetail, Skill, Workshop } from "@/types";

export const skills: Skill[] = [
  {
    id: "clear-instructions",
    title: "Clear Instructions",
    description: "Frame the task so the AI knows exactly what outcome you need.",
  },
  {
    id: "relevant-context",
    title: "Relevant Context",
    description: "Include the details that help the response match the situation.",
  },
  {
    id: "tone-and-audience",
    title: "Tone and Audience",
    description: "Guide the response for the right reader, relationship, and tone.",
  },
  {
    id: "constraints",
    title: "Constraints",
    description: "Set boundaries so the AI avoids overpromising or missing limits.",
  },
  {
    id: "output-formatting",
    title: "Output Formatting",
    description: "Request a useful format such as an email, summary, or checklist.",
  },
  {
    id: "verification",
    title: "Verification",
    description: "Prompt the AI to acknowledge uncertainty and double-check weak spots.",
  },
  {
    id: "responsible-ai-use",
    title: "Responsible AI Use",
    description: "Use AI without sharing sensitive information or skipping judgment.",
  },
];

export const industries: Industry[] = [
  {
    id: "construction",
    name: "Construction",
    slug: "construction",
    description: "Practice customer communication, documentation, estimating, and field-to-office workflows.",
    status: "available",
    href: "/industries/construction",
  },
  {
    id: "administrative-operations",
    name: "Administrative & Operations",
    slug: "administrative-operations",
    description: "Process coordination, internal messaging, and operational follow-up scenarios.",
    status: "coming-soon",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    slug: "real-estate",
    description: "Listing communication, client updates, and vendor coordination practice.",
    status: "coming-soon",
  },
  {
    id: "banking-finance",
    name: "Banking & Finance",
    slug: "banking-finance",
    description: "Professional drafting workflows that support clarity, compliance, and review.",
    status: "coming-soon",
  },
  {
    id: "healthcare-administration",
    name: "Healthcare Administration",
    slug: "healthcare-administration",
    description: "Practice internal coordination and patient-safe administrative messaging.",
    status: "coming-soon",
  },
  {
    id: "human-resources",
    name: "Human Resources",
    slug: "human-resources",
    description: "Scenario-based practice for policy communication, recruiting, and documentation.",
    status: "coming-soon",
  },
  {
    id: "marketing",
    name: "Marketing",
    slug: "marketing",
    description: "Campaign drafting, stakeholder reviews, and AI-assisted content refinement.",
    status: "coming-soon",
  },
];

export const constructionWorkshops: Workshop[] = [
  {
    id: "client-communication",
    industryId: "construction",
    title: "Client Communication",
    slug: "client-communication",
    description: "Practice how to guide AI to draft polished, trustworthy customer-facing messages.",
    status: "available",
    skills: ["clear-instructions", "tone-and-audience", "constraints", "verification"],
    estimatedMinutes: 20,
    href: "/workshops/construction/client-communication",
  },
  {
    id: "proposals-estimates",
    industryId: "construction",
    title: "Proposals & Estimates",
    slug: "proposals-estimates",
    description: "Draft structured estimate language without oversimplifying scope.",
    status: "coming-soon",
    skills: ["relevant-context", "constraints", "output-formatting"],
  },
  {
    id: "project-documentation",
    industryId: "construction",
    title: "Project Documentation",
    slug: "project-documentation",
    description: "Turn field updates into organized office-ready documentation.",
    status: "coming-soon",
    skills: ["clear-instructions", "output-formatting", "verification"],
  },
  {
    id: "employee-communication",
    industryId: "construction",
    title: "Employee Communication",
    slug: "employee-communication",
    description: "Write professional internal messages for crews, supervisors, and office staff.",
    status: "coming-soon",
    skills: ["tone-and-audience", "constraints", "responsible-ai-use"],
  },
  {
    id: "marketing-website-content",
    industryId: "construction",
    title: "Marketing & Website Content",
    slug: "marketing-website-content",
    description: "Refine marketing copy without losing credibility or specificity.",
    status: "coming-soon",
    skills: ["tone-and-audience", "relevant-context", "verification"],
  },
  {
    id: "research-vendor-comparison",
    industryId: "construction",
    title: "Research & Vendor Comparison",
    slug: "research-vendor-comparison",
    description: "Use AI for organized comparisons while keeping human review in the loop.",
    status: "coming-soon",
    skills: ["verification", "responsible-ai-use", "output-formatting"],
  },
  {
    id: "responsible-ai-for-construction",
    industryId: "construction",
    title: "Responsible AI for Construction",
    slug: "responsible-ai-for-construction",
    description: "Learn safe usage patterns for customer, employee, and job information.",
    status: "coming-soon",
    skills: ["responsible-ai-use", "verification", "constraints"],
  },
];

export const clientCommunicationScenarios: Scenario[] = [
  {
    id: "1",
    canonicalId: "construction-client-communication-1",
    workshopId: "client-communication",
    title: "Responding to a Customer Request",
    description: "Guide AI to draft a reassuring update without promising a date you cannot confirm.",
    status: "active",
  },
  {
    id: "2",
    canonicalId: "construction-client-communication-2",
    workshopId: "client-communication",
    title: "Explaining a Weather Delay",
    description: "Practice communicating uncertainty while preserving trust.",
    status: "locked",
  },
  {
    id: "3",
    canonicalId: "construction-client-communication-3",
    workshopId: "client-communication",
    title: "Turning Field Notes into a Client Update",
    description: "Convert rough notes into a polished progress email.",
    status: "locked",
  },
  {
    id: "4",
    canonicalId: "construction-client-communication-4",
    workshopId: "client-communication",
    title: "Revising an Unprofessional Message",
    description: "Use AI to improve tone, clarity, and professionalism.",
    status: "locked",
  },
  {
    id: "5",
    canonicalId: "construction-client-communication-5",
    workshopId: "client-communication",
    title: "Final Client Communication Challenge",
    description: "Combine audience, context, and judgment in a final scenario.",
    status: "locked",
  },
];

export const scenarioOneDetail: ScenarioDetail = {
  ...clientCommunicationScenarios[0],
  labels: {
    workshop: "Client Communication",
    industry: "Construction",
  },
  situation:
    "A homeowner named Jordan emailed asking when their roofing project will begin. Their original anticipated start period was the week of August 10, but scheduling may shift by several days because of rain affecting earlier projects. The company wants to respond professionally, acknowledge the question, explain the situation clearly, and avoid promising an exact date that has not yet been confirmed.",
  assignment:
    "Write a prompt that instructs an AI assistant to draft the customer response.",
  importantDetails: [
    { label: "Audience", value: "Homeowner" },
    { label: "Communication method", value: "Email" },
    { label: "Desired tone", value: "Professional, calm, and reassuring" },
    { label: "Confirmed information", value: "The original anticipated start period was the week of August 10" },
    { label: "Uncertainty", value: "Rain may cause a delay of several days" },
    { label: "Important constraint", value: "Do not promise an exact start date" },
    { label: "Desired outcome", value: "Reassure the customer and explain that an updated schedule will be provided" },
  ],
  hints: [
    "Name the audience and the communication format you want back.",
    "Tell the AI what information is confirmed versus uncertain.",
    "Add at least one instruction about what the draft should avoid.",
  ],
  privacyNotice:
    "For practice, use fictional or anonymized information. Do not enter confidential customer, employee, financial, medical, legal, account, or identifying information.",
};

export const recommendedWorkshop = constructionWorkshops[0];
