import type { Skill } from "@/types";

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
      <h3 className="text-lg font-semibold text-[var(--color-navy)]">{skill.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--color-slate)]">{skill.description}</p>
    </div>
  );
}
