"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { STATS } from "@/lib/data";
import Reveal from "@/components/Reveal";
import Star from "@/components/Star";

function StatValue({
  value,
  suffix,
  text,
}: {
  value: number | null;
  suffix?: string;
  text?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (value === null || !ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        ref.current.textContent = `${value}${suffix ?? ""}`;
        return;
      }

      const obj = { n: 0 };
      gsap.to(obj, {
        n: value,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 90%",
        },
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = `${Math.round(obj.n)}${suffix ?? ""}`;
          }
        },
      });
    },
    { dependencies: [value, suffix] },
  );

  if (text) {
    return (
      <span className="type-stat font-display font-semibold">
        {text}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className="type-stat font-display font-semibold"
    >
      0{suffix}
    </span>
  );
}

function TiltStat({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-2px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

export default function About() {
  const rule = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!rule.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(rule.current, { scaleX: 1 });
      return;
    }
    gsap.fromTo(
      rule.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: { trigger: rule.current, start: "top 85%" },
      },
    );
  });

  return (
    <section id="about" className="relative bg-ivory py-20 md:py-28 lg:py-32">
      <div className="container-x mx-auto max-w-[1440px]">
        <div className="grid gap-10 pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pb-12">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-2 text-wine">
              <Star className="h-2.5 w-2.5" />
              Расскажем
            </p>
            <h2 className="type-section-title-lg font-display font-semibold">
              О нас.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col justify-end">
            <p className="type-body-lg max-w-[42ch] text-ink/75">
              Юридическое агентство Астерия защищает интересы людей и бизнеса в
              судах и сделках. Работаем прозрачно, сопровождаем клиента на каждом
              этапе. Онлайн по всей России.
            </p>
          </Reveal>
        </div>

        {/* Фишка: линия-правило выезжает как росчерк пера */}
        <div
          ref={rule}
          className="origin-left border-b border-ink/15"
          style={{ transform: "scaleX(0)" }}
        />

        <div className="mt-10 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {STATS.map((stat, i) => {
            const isAyur = "text" in stat && stat.text === "АЮР";
            return (
              <Reveal key={stat.label} delay={i * 0.06}>
                <TiltStat
                  className={`relative flex min-h-[180px] flex-col justify-between p-6 md:min-h-[220px] md:p-8 ${
                    isAyur ? "bg-wine text-ivory" : "bg-ivory"
                  }`}
                >
                  <span
                    className={`type-micro font-mono uppercase ${
                      isAyur ? "text-ivory/50" : "text-ink/35"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <StatValue
                      value={stat.value}
                      suffix={"suffix" in stat ? stat.suffix : undefined}
                      text={"text" in stat ? stat.text : undefined}
                    />
                    <p
                      className={`mt-3 max-w-[18ch] text-sm leading-snug ${
                        isAyur ? "text-ivory/70" : "text-ink/55"
                      }`}
                    >
                      {stat.label}
                    </p>
                  </div>

                  {isAyur && (
                    <span
                      aria-hidden="true"
                      className="type-micro pointer-events-none absolute top-5 right-5 rotate-12 border border-ivory/40 px-2 py-1 font-mono uppercase text-ivory/70"
                    >
                      Confidential
                    </span>
                  )}
                </TiltStat>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-12 max-w-[40ch] md:mt-16">
          <p className="type-body-sm text-ink/60">
            Онлайн по всему миру. Ведём дела дистанционно — экономим ваше время,
            где бы вы ни находились.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
