export function ScoreRing({ score }: { score: number }) {
  const normalized = Math.max(0, Math.min(100, score));
  const degrees = Math.round((normalized / 100) * 360);

  return (
    <div
      className="grid h-24 w-24 place-items-center rounded-full border border-[var(--color-border)] bg-white shadow-sm"
      style={{
        background: `conic-gradient(var(--color-accent) ${degrees}deg, var(--color-muted) ${degrees}deg 360deg)`,
      }}
      aria-label={`Overall score ${normalized} out of 100`}
    >
      <div className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-white text-center">
        <div>
          <div className="text-2xl font-semibold text-[var(--color-navy)]">{normalized}</div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-slate)]">Score</div>
        </div>
      </div>
    </div>
  );
}
