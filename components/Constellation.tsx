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
      <div className="container-x mx-auto flex max-w-[1440px] items-end justify-between gap-6 pt-8 pb-2 md:pt-10">
        <p className="eyebrow text-ink/40">Atlas · Asteria</p>
        <p className="type-label font-mono uppercase text-ink/35">
          α 2018 — каталог практик
        </p>
      </div>

      <div className="container-x mx-auto max-w-[1440px] pb-8 md:pb-10">
        <svg
          viewBox="0 0 1200 220"
          className="h-auto w-full text-wine"
          role="img"
          aria-label="Созвездие практик Астерии"
        >
          <g data-parallax>
            {/* faint grid — archival chart feel */}
            <g stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.6">
              <line x1="0" y1="110" x2="1200" y2="110" />
              <line x1="600" y1="20" x2="600" y2="200" />
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
                strokeOpacity="0.45"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {STARS.map((star, i) => (
              <g key={star.code}>
                <circle
                  data-star
                  cx={star.x}
                  cy={star.y}
                  r={star.r}
                  fill="currentColor"
                />
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.r + 5}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="0.75"
                />
                <text
                  data-label
                  x={star.x + 10}
                  y={star.y - 10}
                  className="font-mono"
                  fill="currentColor"
                  fillOpacity="0.7"
                  fontSize="11"
                  letterSpacing="0.08em"
                >
                  {star.code} · {star.name}
                </text>
                {/* invisible hit area index kept for future interactivity */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={18}
                  fill="transparent"
                  data-star-hit={i}
                />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
}
