import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-navy)] text-white shadow-sm hover:bg-[color-mix(in_oklab,var(--color-navy)_88%,black)]",
  secondary:
    "border border-[var(--color-border)] bg-white text-[var(--color-navy)] hover:border-[var(--color-accent)] hover:bg-[var(--color-muted)]",
  ghost: "text-[var(--color-slate)] hover:bg-[var(--color-muted)] hover:text-[var(--color-navy)]",
};

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: SharedProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  variant = "primary",
  className = "",
  href,
}: SharedProps & { href: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
