export function CoachingCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] p-4">
      <h3 className="text-sm font-semibold text-[var(--color-navy)]">{title}</h3>
      <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--color-slate)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
