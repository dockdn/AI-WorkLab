import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { ScenarioCard } from "@/components/scenario-card";
import { ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { clientCommunicationScenarios, constructionWorkshops, skills } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Client Communication Workshop",
};

export default function ClientCommunicationWorkshopPage() {
  const workshop = constructionWorkshops[0];
  const practicedSkills = skills.filter((skill) => workshop.skills.includes(skill.id));

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section>
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-navy)]">{workshop.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-slate)]">{workshop.description}</p>
            <div className="mt-6 rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-[var(--color-slate)]">Estimated length</div>
                  <div className="mt-2 text-2xl font-semibold text-[var(--color-navy)]">Approximately 20 minutes</div>
                </div>
                <ButtonLink href="/practice/construction/client-communication/1">Begin Workshop</ButtonLink>
              </div>
              <div className="mt-5">
                <ProgressBar value={20} label="Workshop progress" />
              </div>
            </div>
          </section>
          <aside className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-gold-faint)] p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 text-[var(--color-gold-text)]" aria-hidden="true" />
              <p className="text-sm leading-6 text-[var(--color-navy)]">
                Do not enter private customer, employee, financial, medical, legal, or identifying information into an AI system.
              </p>
            </div>
            <div className="mt-6">
              <div className="text-sm font-semibold text-[var(--color-slate)]">Skills practiced</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {practicedSkills.map((skill) => (
                  <span key={skill.id} className="rounded-full bg-white px-3 py-2 text-sm text-[var(--color-slate)]">
                    {skill.title}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-[var(--color-navy)]">Scenarios</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {clientCommunicationScenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                href={scenario.id === "1" ? "/practice/construction/client-communication/1" : undefined}
              />
            ))}
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
