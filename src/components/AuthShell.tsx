import { Link } from "@tanstack/react-router";
import { Coffee } from "lucide-react";
import type { ReactNode } from "react";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <Coffee className="h-4 w-4 text-roast" />
            <span className="font-serif text-xl tracking-tight">RoastNote</span>
          </Link>
          <Link
            to="/"
            className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col px-5 py-16 sm:py-24">
        <span className="inline-flex items-center text-[10px] font-medium uppercase tracking-[0.32em] text-roast">
          <span className="mr-3 inline-block h-px w-7 bg-roast/60" />
          {eyebrow}
        </span>
        <h1 className="mt-6 font-serif text-4xl leading-[1.05] tracking-[-0.02em] text-foreground sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        )}
        <div className="mt-10">{children}</div>
        {footer && (
          <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>
        )}
      </main>
    </div>
  );
}

export const fieldClass =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-foreground focus:outline-none";

export const primaryBtn =
  "inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-[13px] font-medium tracking-wide text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:bg-espresso hover:shadow-[var(--shadow-lift)] disabled:opacity-60";

export const ghostBtn =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary";
