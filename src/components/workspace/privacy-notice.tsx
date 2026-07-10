import { ShieldCheck } from "lucide-react";

export function PrivacyNotice({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-gold-faint)] p-4 text-sm leading-6 text-[var(--color-navy)]">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-[var(--color-gold-text)]" aria-hidden="true" />
        <p>{text}</p>
      </div>
    </div>
  );
}
