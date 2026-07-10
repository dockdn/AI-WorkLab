import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { SkillCard } from "@/components/skill-card";
import { WorkshopCard } from "@/components/workshop-card";
import { ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { constructionWorkshops, recommendedWorkshop, skills } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Construction",
};

export default function ConstructionIndustryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-navy)]">Construction</h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--color-slate)]">
              Practice the communication, documentation, and judgment tasks construction teams face every week, starting with client communication.
            </p>
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-[var(--color-slate)]">Overall progress</div>
                  <div className="mt-2 text-2xl font-semibold text-[var(--color-navy)]">1 available workshop</div>
                </div>
                <div className="text-sm text-[var(--color-slate)]">Expansion-ready structure</div>
              </div>
              <div className="mt-5">
                <ProgressBar value={14} label="Industry path readiness" />
              </div>
            </div>
          </section>
          <aside className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-navy)] p-6 text-white shadow-[var(--shadow-card-hover)]">
            <div className="text-sm font-semibold text-white/72">Recommended next workshop</div>
            <h2 className="mt-3 text-2xl font-semibold">{recommendedWorkshop.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/78">{recommendedWorkshop.description}</p>
            <ButtonLink
              href={recommendedWorkshop.href ?? "/workshops/construction/client-communication"}
              className="mt-6"
              variant="secondary"
            >
              Begin workshop <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-[var(--color-navy)]">Workshops</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {constructionWorkshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-[var(--color-navy)]">Skill categories you will practice</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {skills.slice(0, 6).map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
