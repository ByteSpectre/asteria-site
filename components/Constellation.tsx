"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Geometric star chart — brand signature for «Астерия». */
const STARS = [
  { x: 70, y: 155, r: 3.2, code: "α", name: "Суд", lx: 8, ly: -18 },
  { x: 200, y: 68, r: 2.8, code: "β", name: "Сделки", lx: 10, ly: -20 },
  { x: 330, y: 140, r: 3.4, code: "γ", name: "Активы", lx: 10, ly: -20 },
  { x: 460, y: 52, r: 2.6, code: "δ", name: "Семья", lx: 10, ly: -20 },
  { x: 590, y: 168, r: 3.2, code: "ε", name: "Бизнес", lx: 10, ly: 28 },
  { x: 720, y: 78, r: 2.8, code: "ζ", name: "Земля", lx: 10, ly: -20 },
  { x: 850, y: 152, r: 3.0, code: "η", name: "Труд", lx: 10, ly: -20 },
  { x: 980, y: 58, r: 2.6, code: "θ", name: "Налоги", lx: 10, ly: -20 },
  { x: 1110, y: 132, r: 3.6, code: "ι", name: "АЮР", lx: -52, ly: -20 },
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
      <div className="container-x relative z-10 mx-auto flex max-w-[1440px] flex-col gap-3 pt-10 pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pt-10 sm:pb-3 md:pt-12">
        <p className="eyebrow text-ink/45">Atlas · Asteria</p>
        <p className="type-label font-mono uppercase text-ink/40 sm:text-right">
          α 2018 — каталог практик
        </p>
      </div>

      <div className="relative z-10 pb-10 md:container-x md:mx-auto md:max-w-[1440px] md:pb-12">
        <div className="overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible">
          <div className="min-w-[920px] px-5 md:min-w-0 md:px-0">
            <svg
              viewBox="0 0 1200 260"
              className="h-[260px] w-full text-wine md:h-auto md:min-h-[200px]"
              role="img"
              aria-label="Созвездие практик Астерии"
              preserveAspectRatio="xMidYMid meet"
            >
              <g data-parallax>
                {/* Lines under nodes so joins stay crisp */}
                {EDGES.map(([a, b], i) => (
                  <line
                    key={`e-${i}`}
                    data-line
                    x1={STARS[a].x}
                    y1={STARS[a].y}
                    x2={STARS[b].x}
                    y2={STARS[b].y}
                    stroke="currentColor"
                    strokeOpacity="0.7"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ))}

                {STARS.map((star, i) => (
                  <g key={star.code}>
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={star.r + 5}
                      fill="#fbf8f1"
                    />
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
                      strokeOpacity="0.35"
                      strokeWidth="1.25"
                    />
                    <text
                      data-label
                      x={star.x + star.lx}
                      y={star.y + star.ly}
                      className="font-mono"
                      fill="currentColor"
                      fillOpacity="0.85"
                      fontSize="15"
                      fontWeight="400"
                      letterSpacing="0.04em"
                    >
                      {star.code} · {star.name}
                    </text>
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={22}
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
