import type { ReactNode } from "react";

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "gold" | "muted" }) {
  const toneClass =
    tone === "gold"
      ? "bg-[var(--color-gold-soft)] text-[var(--color-gold-text)]"
      : tone === "muted"
        ? "bg-[var(--color-muted)] text-[var(--color-slate)]"
        : "bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]";

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.02em] ${toneClass}`}>
      {children}
    </span>
  );
}
