import type { Metadata } from "next";
import Link from "next/link";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { PromptComposer } from "@/components/workspace/prompt-composer";
import { PrivacyNotice } from "@/components/workspace/privacy-notice";
import { ScenarioBrief } from "@/components/workspace/scenario-brief";
import { scenarioOneDetail } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Practice Scenario 1",
};

export default function PracticeScenarioOnePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--color-slate)]">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/industries" className="hover:text-[var(--color-navy)]">Industries</Link>
            <span>/</span>
            <Link href="/industries/construction" className="hover:text-[var(--color-navy)]">Construction</Link>
            <span>/</span>
            <Link href="/workshops/construction/client-communication" className="hover:text-[var(--color-navy)]">Client Communication</Link>
            <span>/</span>
            <span className="text-[var(--color-navy)]">Scenario 1</span>
          </div>
        </nav>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[var(--color-slate)]">Workshop: Client Communication</div>
              <div className="mt-1 text-lg font-semibold text-[var(--color-navy)]">Progress: Scenario 1 of 5</div>
            </div>
          </div>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="space-y-5">
              <ScenarioBrief scenario={scenarioOneDetail} />
              <PrivacyNotice text={scenarioOneDetail.privacyNotice} />
            </div>
            <PromptComposer scenarioId={scenarioOneDetail.canonicalId} />
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
