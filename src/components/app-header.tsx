import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

const navItems = [
  { href: "/workshops/construction/client-communication", label: "Workshops" },
  { href: "/industries", label: "Industries" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About" },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-page)_92%,white)]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold tracking-[0.08em] text-[var(--color-navy)]">
            AI WorkLab
          </Link>
          <ButtonLink href="/practice/construction/client-communication/1" className="hidden sm:inline-flex">
            Start Practicing
          </ButtonLink>
        </div>
        <nav aria-label="Primary" className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--color-slate)] transition hover:text-[var(--color-navy)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
