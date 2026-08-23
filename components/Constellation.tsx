"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ASTERIA_CONSTELLATION } from "@/lib/data";

const ZIGZAG_OFFSET = 52;

const CONSTELLATION_WIDTH = 1440;
const CONSTELLATION_HEIGHT = 340;
const STAR_SPACING = 204;
const STAR_START_X = 108;
const STAR_CENTER_Y = 154;
const STAR_RADIUS = 4.5;
const LABEL_OFFSET = 28;
const LABEL_SIZE = 16;
const HIT_SIZE = 64;
const LINE_WIDTH = 2.5;
const EDGE_PAD = 30;

const STARS = ASTERIA_CONSTELLATION.map((star, index) => ({
  ...star,
  x: STAR_START_X + index * STAR_SPACING,
  y: STAR_CENTER_Y + (index % 2 === 0 ? -ZIGZAG_OFFSET : ZIGZAG_OFFSET),
  r: STAR_RADIUS,
}));

const EDGES: [number, number][] = STARS.slice(0, -1).map((_, index) => [index, index + 1]);

function roundCoord(n: number) {
  return Math.round(n * 1000) / 1000;
}

function edgePoints(a: (typeof STARS)[number], b: (typeof STARS)[number], pad = EDGE_PAD) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: roundCoord(a.x + ux * pad),
    y1: roundCoord(a.y + uy * pad),
    x2: roundCoord(b.x - ux * pad),
    y2: roundCoord(b.y - uy * pad),
  };
}

export default function Constellation() {
  const root = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

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
        stagger: 0.06,
        ease: "back.out(1.6)",
      })
        .to(
          lines,
          {
            strokeDashoffset: 0,
            duration: 1,
            stagger: 0.05,
            ease: "power2.inOut",
          },
          0.15,
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
          0.45,
        );
    },
    { scope: root },
  );

  useGSAP(
    () => {
      const panel = detailRef.current;
      if (!panel) return;

      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
        },
      );
    },
    { dependencies: [active], scope: root },
  );

  const activeStar = active === null ? null : STARS[active];

  return (
    <section
      ref={root}
      aria-label="Созвездие ценностей Астерии"
      className="relative overflow-hidden border-y border-ink/10 bg-ivory"
    >
      <div className="container-x relative z-10 mx-auto flex max-w-[1440px] flex-col gap-3 pt-10 pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pt-10 sm:pb-3 md:pt-12">
        <p className="eyebrow text-ink/45">A · S · T · E · R · I · A</p>
        <p className="type-label font-mono uppercase text-ink/40 sm:text-right">
          Созвездие ценностей агентства
        </p>
      </div>

      <div className="container-x relative z-10 mx-auto max-w-[1440px] pb-8 md:pb-10">
        <div className="-mx-5 overflow-x-auto overscroll-x-contain px-5 touch-pan-x sm:-mx-8 sm:px-8 2xl:mx-0 2xl:overflow-visible 2xl:px-0">
          <svg
            viewBox={`0 0 ${CONSTELLATION_WIDTH} ${CONSTELLATION_HEIGHT}`}
            width={CONSTELLATION_WIDTH}
            height={CONSTELLATION_HEIGHT}
            className="max-w-none shrink-0 text-wine 2xl:h-auto 2xl:w-full 2xl:shrink"
            role="img"
            aria-label="Горизонтальное созвездие ASTERIA"
            preserveAspectRatio="xMidYMid meet"
            onMouseLeave={() => setActive(null)}
          >
          {EDGES.map(([a, b], i) => {
            const p = edgePoints(STARS[a], STARS[b]);
            return (
              <line
                key={`e-${i}`}
                data-line
                x1={p.x1}
                y1={p.y1}
                x2={p.x2}
                y2={p.y2}
                stroke="currentColor"
                strokeOpacity={active === null ? 0.7 : a === active || b === active ? 0.95 : 0.35}
                strokeWidth={LINE_WIDTH}
                strokeLinecap="round"
                className="transition-[stroke-opacity] duration-500"
              />
            );
          })}

          {STARS.map((star, index) => {
            const isActive = active === index;
            return (
              <g key={`${star.letter}-${star.name}`}>
                <circle cx={star.x} cy={star.y} r={star.r + 7} fill="#fbf8f1" />
                <circle
                  data-star
                  cx={star.x}
                  cy={star.y}
                  r={star.r}
                  fill="currentColor"
                  opacity={active === null || isActive ? 1 : 0.45}
                  className="transition-opacity duration-500"
                />
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.r + (isActive ? 11 : 7)}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={isActive ? 0.85 : 0.35}
                  strokeWidth={isActive ? 1.75 : 1.5}
                  className="transition-all duration-500"
                />
                <text
                  data-label
                  x={star.x}
                  y={star.y - LABEL_OFFSET}
                  textAnchor="middle"
                  className="font-mono"
                  fill="currentColor"
                  fillOpacity={isActive ? 1 : active === null ? 0.85 : 0.45}
                  fontSize={LABEL_SIZE}
                  fontWeight="400"
                  letterSpacing="0.04em"
                  paintOrder="stroke fill"
                  stroke="#fbf8f1"
                  strokeWidth="10"
                  strokeLinejoin="round"
                >
                  {star.letter}
                </text>
                <foreignObject
                  x={star.x - HIT_SIZE / 2}
                  y={star.y - HIT_SIZE / 2}
                  width={HIT_SIZE}
                  height={HIT_SIZE}
                >
                  <button
                    type="button"
                    aria-label={`${star.name}: ${star.description}`}
                    aria-pressed={isActive}
                    className="h-full w-full cursor-pointer rounded-full bg-transparent"
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive((current) => (current === index ? null : index))}
                  />
                </foreignObject>
              </g>
            );
          })}
          </svg>
        </div>

        <div
          ref={detailRef}
          aria-live="polite"
          className="mt-6 min-h-[5.5rem] border-t border-ink/10 pt-6"
        >
          {activeStar ? (
            <>
              <p className="type-label font-mono uppercase text-wine">
                {activeStar.letter} · {activeStar.name}
              </p>
              <p className="type-body-sm mt-3 max-w-[52ch] text-ink/70">
                {activeStar.description}
              </p>
            </>
          ) : (
            <>
              <p className="type-body-sm text-ink/40 md:hidden">
                Нажмите на звезду, чтобы увидеть описание ценности.
              </p>
              <p className="type-body-sm hidden text-ink/40 md:block">
                Наведите на звезду, чтобы увидеть описание ценности.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
