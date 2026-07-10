export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="space-y-2">
      {label ? <div className="flex justify-between text-sm text-[var(--color-slate)]"><span>{label}</span><span>{value}%</span></div> : null}
      <div className="h-2.5 rounded-full bg-[var(--color-muted)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-accent),var(--color-navy))]"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
