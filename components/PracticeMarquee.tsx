"use client";

import { useEffect, useRef } from "react";
import { SERVICES } from "@/lib/data";
import SectionConstellation from "@/components/SectionConstellation";

const ITEMS = [
  ...SERVICES.individuals.map((s) => s.title),
  ...SERVICES.business.map((s) => s.title),
];

export default function PracticeMarquee() {
  const row = [...ITEMS, ...ITEMS];
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        el.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      aria-label="Практики агентства"
      className="relative overflow-hidden border-b border-ink/10 bg-wine py-4 text-ivory md:py-5"
    >
      <SectionConstellation tone="ivory" opacity={0.022} />
      <div
        ref={trackRef}
        className="relative z-10 flex w-max animate-marquee hover:[animation-play-state:paused]"
      >
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
