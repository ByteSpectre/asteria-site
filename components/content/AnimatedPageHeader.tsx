"use client";

import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type AnimatedPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: ReactNode;
};

export function AnimatedPageHeader({ eyebrow, title, description }: AnimatedPageHeaderProps) {
  return (
    <header className="grid gap-6 border-b border-ink/10 pb-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
      <Reveal>
        <div>
          <p className="eyebrow text-wine">{eyebrow}</p>
          <h1 className="mt-5 text-[clamp(3.2rem,7vw,7.5rem)] leading-[0.9] tracking-[-0.075em]">
            {title}
          </h1>
        </div>
      </Reveal>
      <Reveal delay={0.1} className="lg:justify-self-end">
        <p className="max-w-[50ch] text-sm leading-relaxed text-ink/48">{description}</p>
      </Reveal>
    </header>
  );
}
