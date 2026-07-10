import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-sm text-[var(--color-slate)] sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <div className="text-base font-semibold text-[var(--color-navy)]">AI WorkLab</div>
          <p>Scenario-based AI practice for business professionals who need better judgment, clearer prompts, and more reliable outputs.</p>
        </div>
        <div className="space-y-2">
          <div className="font-semibold text-[var(--color-navy)]">Explore</div>
          <Link href="/industries" className="block hover:text-[var(--color-navy)]">Industries</Link>
          <Link href="/workshops/construction/client-communication" className="block hover:text-[var(--color-navy)]">Workshops</Link>
        </div>
        <div className="space-y-2">
          <div className="font-semibold text-[var(--color-navy)]">Prototype Scope</div>
          <p>Local mock data, local progress tracking, and prototype feedback designed for later server-side AI integration.</p>
        </div>
      </div>
    </footer>
  );
}
