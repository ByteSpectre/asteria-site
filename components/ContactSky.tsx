"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type StarPt = { x: number; y: number; r: number; label?: string };

const STARS: StarPt[] = [
  { x: 8, y: 18, r: 1.2 },
  { x: 14, y: 42, r: 1.8, label: "α" },
  { x: 22, y: 28, r: 1.1 },
  { x: 28, y: 55, r: 2.2, label: "β" },
  { x: 36, y: 22, r: 1.4 },
  { x: 42, y: 48, r: 1.6 },
  { x: 48, y: 35, r: 2.6, label: "γ" },
  { x: 55, y: 62, r: 1.3 },
  { x: 62, y: 25, r: 1.9, label: "δ" },
  { x: 68, y: 45, r: 1.2 },
  { x: 74, y: 18, r: 1.5 },
  { x: 78, y: 58, r: 2.0, label: "ε" },
  { x: 85, y: 32, r: 1.3 },
  { x: 90, y: 50, r: 1.7 },
  { x: 94, y: 22, r: 1.1 },
  { x: 18, y: 72, r: 1.4 },
  { x: 32, y: 78, r: 1.0 },
  { x: 52, y: 80, r: 1.6, label: "ζ" },
  { x: 70, y: 75, r: 1.2 },
  { x: 88, y: 70, r: 1.8 },
  { x: 5, y: 65, r: 0.9 },
  { x: 96, y: 40, r: 1.0 },
];

const EDGES: [number, number][] = [
  [1, 3],
  [3, 6],
  [6, 8],
  [8, 11],
  [1, 6],
  [6, 11],
  [3, 17],
  [11, 19],
  [8, 13],
  [17, 19],
  [6, 17],
];

export default function ContactSky() {
  const root = useRef<HTMLDivElement>(null);
  const layer = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lines = el.querySelectorAll<SVGLineElement>("[data-sky-line]");
      const dots = el.querySelectorAll<SVGCircleElement>("[data-sky-star]");

      if (reduced) {
        gsap.set([lines, dots], { opacity: 1, clearProps: "strokeDashoffset" });
        return;
      }

      lines.forEach((line) => {
        const len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(dots, { opacity: 0, scale: 0, transformOrigin: "center" });

      const section = el.parentElement ?? el;
      const pulses: gsap.core.Tween[] = [];

      const killPulses = () => {
        pulses.forEach((p) => p.kill());
        pulses.length = 0;
      };

      const startPulses = () => {
        killPulses();
        dots.forEach((dot, i) => {
          if (i % 4 !== 0) return;
          pulses.push(
            gsap.to(dot, {
              opacity: 0.25,
              duration: 2.2 + (i % 3) * 0.4,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
              delay: i * 0.12,
            }),
          );
        });
      };

      // Рисуется при входе, стирается при обратном скролле
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          end: "top 28%",
          scrub: 1.15,
          onEnter: startPulses,
          onEnterBack: startPulses,
          onLeave: killPulses,
          onLeaveBack: killPulses,
        },
      });

      tl.to(dots, {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        stagger: 0.03,
        ease: "power2.out",
      }).to(
        lines,
        {
          strokeDashoffset: 0,
          duration: 1.2,
          stagger: 0.05,
          ease: "none",
        },
        0.12,
      );

      if (!layer.current) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const onMove = (e: Event) => {
        const me = e as MouseEvent;
        const rect = section.getBoundingClientRect();
        const nx = (me.clientX - rect.left) / rect.width - 0.5;
        const ny = (me.clientY - rect.top) / rect.height - 0.5;
        gsap.to(layer.current, {
          xPercent: nx * 4,
          yPercent: ny * 3,
          duration: 1.1,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const onLeave = () => {
        gsap.to(layer.current, {
          xPercent: 0,
          yPercent: 0,
          duration: 1.2,
          ease: "power3.out",
        });
      };

      section.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);

      return () => {
        section.removeEventListener("mousemove", onMove);
        section.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full text-ivory"
      >
        <g ref={layer} opacity="0.1">
          <g stroke="currentColor" strokeWidth="0.08" opacity="0.3">
            {Array.from({ length: 9 }, (_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={(i + 1) * 10}
                x2="100"
                y2={(i + 1) * 10}
              />
            ))}
            {Array.from({ length: 9 }, (_, i) => (
              <line
                key={`v-${i}`}
                x1={(i + 1) * 10}
                y1="0"
                x2={(i + 1) * 10}
                y2="100"
              />
            ))}
          </g>

          <path
            d="M 5 95 Q 50 40 95 95"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.12"
            opacity="0.4"
          />
          <path
            d="M 10 5 Q 50 55 90 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.1"
            opacity="0.3"
          />

          {EDGES.map(([a, b], i) => (
            <line
              key={`l-${i}`}
              data-sky-line
              x1={STARS[a].x}
              y1={STARS[a].y}
              x2={STARS[b].x}
              y2={STARS[b].y}
              stroke="currentColor"
              strokeWidth="0.18"
              opacity="0.7"
            />
          ))}

          {STARS.map((s, i) => (
            <g key={i}>
              <circle
                data-sky-star
                cx={s.x}
                cy={s.y}
                r={s.r * 0.35}
                fill="currentColor"
              />
              {s.label && (
                <text
                  x={s.x + 1.2}
                  y={s.y - 1.2}
                  fill="currentColor"
                  fontSize="2.2"
                  className="font-mono"
                  opacity="0.55"
                >
                  {s.label}
                </text>
              )}
            </g>
          ))}

          <text
            x="3"
            y="6"
            fill="currentColor"
            fontSize="2.4"
            className="font-mono"
            opacity="0.5"
          >
            ATLAS · ASTERIA
          </text>
          <text
            x="72"
            y="96"
            fill="currentColor"
            fontSize="2.2"
            className="font-mono"
            opacity="0.45"
          >
            RA 18h · DEC +42°
          </text>
        </g>
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(67,28,38,0.35)_75%,rgba(67,28,38,0.65)_100%)]" />
    </div>
  );
}
