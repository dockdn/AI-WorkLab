import { ArrowRight, CheckCircle2, ChevronRight, ClipboardCheck, ShieldCheck, Sparkles } from "lucide-react";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { IndustryCard } from "@/components/industry-card";
import { SkillCard } from "@/components/skill-card";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { industries, skills } from "@/data/catalog";

const howItWorks = [
  {
    title: "Choose your industry",
    description: "Start in a work context that feels familiar so the prompt practice stays realistic.",
  },
  {
    title: "Practice a real scenario",
    description: "Work through assignments that mirror emails, updates, drafts, and operational decisions.",
  },
  {
    title: "Improve with personalized coaching",
    description: "See where your prompt is strong, where it is risky, and how to tighten it for better output.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl space-y-8">
            <Badge tone="gold">Interactive workplace practice</Badge>
            <div className="space-y-5">
              <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-[var(--color-navy)] sm:text-6xl">
                Learn AI by doing the work you already do.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-[var(--color-slate)]">
                AI WorkLab helps professionals practice realistic workplace scenarios, test prompts, and improve with clear coaching built around judgment, tone, and constraints.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/practice/construction/client-communication/1">Start Practicing</ButtonLink>
              <ButtonLink href="/workshops/construction/client-communication" variant="secondary">
                Explore Workshops
              </ButtonLink>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                "Prompt with context and constraints",
                "See a simulated AI output",
                "Improve through structured coaching",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-[var(--color-border)] bg-white/80 p-4 text-sm text-[var(--color-slate)] shadow-[var(--shadow-card)]">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-[var(--color-accent)]" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card-hover)]">
            <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-page)] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--color-slate)]">Scenario workspace</div>
                  <div className="mt-1 text-xl font-semibold text-[var(--color-navy)]">Responding to a Customer Request</div>
                </div>
                <Badge>Scenario 1</Badge>
              </div>
              <div className="mt-5 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-4 rounded-3xl bg-white p-4">
                  <div className="rounded-2xl bg-[var(--color-muted)] p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-slate)]">Assignment</div>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-navy)]">Draft a prompt that helps AI answer a homeowner asking about a roofing project start date.</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--color-border)] p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-slate)]">Prompt composer</div>
                    <div className="mt-3 h-28 rounded-2xl bg-[var(--color-page)]" />
                    <div className="mt-4 flex gap-3">
                      <div className="h-10 flex-1 rounded-full bg-[var(--color-navy)]" />
                      <div className="h-10 w-24 rounded-full bg-[var(--color-muted)]" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 rounded-3xl bg-[var(--color-navy)] p-4 text-white">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Sparkles className="h-4 w-4" aria-hidden="true" /> Prototype feedback
                  </div>
                  <div className="rounded-2xl bg-white/8 p-4">
                    <div className="text-sm font-semibold">Overall score</div>
                    <div className="mt-2 text-4xl font-semibold">84</div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 text-[var(--color-navy)]">
                    <div className="text-sm font-semibold">Generated customer email</div>
                    <div className="mt-3 space-y-2 text-sm text-[var(--color-slate)]">
                      <p>Thanks for checking in, Jordan.</p>
                      <p>Our original anticipated start window is still the week of August 10, though rain may shift timing slightly.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-navy)]">How It Works</h2>
            <p className="mt-4 text-base leading-7 text-[var(--color-slate)]">
              Practice the same kinds of communication and decision-support tasks your team already faces, then refine your prompts with structured feedback.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {howItWorks.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
                <div className="text-sm font-semibold text-[var(--color-accent-text)]">0{index + 1}</div>
                <h3 className="mt-4 text-xl font-semibold text-[var(--color-navy)]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--color-slate)]">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-navy)]">Skills you will actually build</h2>
              <p className="mt-4 text-base leading-7 text-[var(--color-slate)]">
                The goal is not theory alone. The platform trains practical habits that make AI outputs safer, clearer, and more useful.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-navy)]">Industry tracks designed for expansion</h2>
                <p className="mt-4 text-base leading-7 text-[var(--color-slate)]">
                  Construction is first, with additional business functions ready to be added using the same workshop and scenario structure.
                </p>
              </div>
              <ButtonLink href="/industries" variant="secondary">
                View all industries
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {industries.slice(0, 6).map((industry) => (
                <IndustryCard key={industry.id} industry={industry} />
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-navy)] px-8 py-10 text-white shadow-[var(--shadow-card-hover)]">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Built for realistic, responsible AI practice
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight">Build stronger prompt judgment before AI is part of every workflow.</h2>
                <p className="mt-4 text-base leading-7 text-white/78">
                  AI WorkLab is a product prototype for scenario-based training. It uses local mock data and prototype feedback today, with the interface prepared for future secure server-side AI evaluation.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/practice/construction/client-communication/1">Start Practicing</ButtonLink>
                <ButtonLink href="/industries" variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/16">
                  Explore Industries <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                { icon: ClipboardCheck, text: "Structured prompt coaching" },
                { icon: ChevronRight, text: "Progressive scenario practice" },
                { icon: ShieldCheck, text: "Sensitive-data reminders throughout" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="rounded-2xl border border-white/12 bg-white/6 p-4 text-sm text-white/80">
                  <Icon className="mb-3 h-5 w-5" aria-hidden="true" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
