"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Geometric star chart — brand signature for «Астерия». No glow, no particles. */
const STARS = [
  { x: 80, y: 150, r: 2.2, code: "α", name: "Суд" },
  { x: 210, y: 70, r: 1.8, code: "β", name: "Сделки" },
  { x: 340, y: 130, r: 2.6, code: "γ", name: "Активы" },
  { x: 470, y: 55, r: 1.6, code: "δ", name: "Семья" },
  { x: 590, y: 160, r: 2.4, code: "ε", name: "Бизнес" },
  { x: 720, y: 85, r: 1.9, code: "ζ", name: "Земля" },
  { x: 850, y: 145, r: 2.1, code: "η", name: "Труд" },
  { x: 980, y: 60, r: 1.7, code: "θ", name: "Налоги" },
  { x: 1100, y: 125, r: 2.8, code: "ι", name: "АЮР" },
] as const;

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [4, 6],
];

export default function Constellation() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lines = el.querySelectorAll<SVGLineElement>("[data-line]");
      const stars = el.querySelectorAll<SVGCircleElement>("[data-star]");
      const labels = el.querySelectorAll<SVGTextElement>("[data-label]");

      if (reduced) {
        gsap.set([lines, stars, labels], { clearProps: "all", opacity: 1 });
        lines.forEach((line) => {
          line.style.strokeDasharray = "none";
          line.style.strokeDashoffset = "0";
        });
        return;
      }

      lines.forEach((line) => {
        const len = line.getTotalLength();
        line.style.strokeDasharray = `${len}`;
        line.style.strokeDashoffset = `${len}`;
      });

      gsap.set(stars, { scale: 0, transformOrigin: "center", opacity: 0 });
      gsap.set(labels, { opacity: 0, y: 6 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          once: true,
        },
      });

      tl.to(stars, {
        scale: 1,
        opacity: 1,
        duration: 0.55,
        stagger: 0.05,
        ease: "back.out(1.6)",
      })
        .to(
          lines,
          {
            strokeDashoffset: 0,
            duration: 1.1,
            stagger: 0.06,
            ease: "power2.inOut",
          },
          0.2,
        )
        .to(
          labels,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.04,
            ease: "power2.out",
          },
          0.55,
        );

      const layer = el.querySelector<SVGGElement>("[data-parallax]");
      if (!layer || window.matchMedia("(pointer: coarse)").matches) return;

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(layer, {
          x: nx * 14,
          y: ny * 10,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const onLeave = () => {
        gsap.to(layer, { x: 0, y: 0, duration: 1, ease: "power3.out" });
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);

      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="Карта Астерии"
      className="relative overflow-hidden border-y border-ink/10 bg-ivory"
    >
      <div className="container-x mx-auto flex max-w-[1440px] flex-col gap-3 pt-10 pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pt-10 sm:pb-3 md:pt-12">
        <p className="eyebrow text-ink/45">Atlas · Asteria</p>
        <p className="type-label font-mono uppercase text-ink/40 sm:text-right">
          α 2018 — каталог практик
        </p>
      </div>

      <div className="pb-10 md:container-x md:mx-auto md:max-w-[1440px] md:pb-12">
        {/* On mobile: keep chart large via horizontal scroll instead of squashing */}
        <div className="overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible">
          <div className="min-w-[920px] px-5 md:min-w-0 md:px-0">
            <svg
              viewBox="0 0 1200 240"
              className="h-[240px] w-full text-wine md:h-auto md:min-h-[180px]"
              role="img"
              aria-label="Созвездие практик Астерии"
              preserveAspectRatio="xMidYMid meet"
            >
              <g data-parallax>
                <g stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.6">
                  <line x1="0" y1="120" x2="1200" y2="120" />
                  <line x1="600" y1="24" x2="600" y2="216" />
                </g>

                {EDGES.map(([a, b], i) => (
                  <line
                    key={`e-${i}`}
                    data-line
                    x1={STARS[a].x}
                    y1={STARS[a].y}
                    x2={STARS[b].x}
                    y2={STARS[b].y}
                    stroke="currentColor"
                    strokeOpacity="0.55"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}

                {STARS.map((star, i) => (
                  <g key={star.code}>
                    <circle
                      data-star
                      cx={star.x}
                      cy={star.y}
                      r={star.r * 1.6}
                      fill="currentColor"
                    />
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={star.r * 1.6 + 7}
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity="0.22"
                      strokeWidth="1"
                    />
                    <text
                      data-label
                      x={star.x + 14}
                      y={star.y - 14}
                      className="font-mono"
                      fill="currentColor"
                      fillOpacity="0.78"
                      fontSize="16"
                      letterSpacing="0.05em"
                    >
                      {star.code} · {star.name}
                    </text>
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={20}
                      fill="transparent"
                      data-star-hit={i}
                    />
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>
        <p className="container-x mt-3 font-mono text-[10px] tracking-[0.14em] text-ink/30 uppercase md:hidden">
          Листайте карту →
        </p>
      </div>
    </section>
  );
}
