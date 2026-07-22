"use client";

import { SERVICES } from "@/lib/data";

const ITEMS = [
  ...SERVICES.individuals.map((s) => s.title),
  ...SERVICES.business.map((s) => s.title),
];

export default function PracticeMarquee() {
  const row = [...ITEMS, ...ITEMS];

  return (
    <section
      aria-label="Практики агентства"
      className="overflow-hidden border-b border-ink/10 bg-wine py-4 text-ivory md:py-5"
    >
      <div className="flex w-max animate-marquee will-change-transform hover:[animation-play-state:paused]">
        {row.map((title, i) => (
          <span
            key={`${title}-${i}`}
            className="type-label flex items-center gap-6 pr-6 font-mono uppercase md:gap-8 md:pr-8"
          >
            <span className="text-ivory/90">{title}</span>
            <span aria-hidden="true" className="inline-block h-1 w-1 rotate-45 bg-ivory/40" />
          </span>
        ))}
      </div>
    </section>
  );
}
