"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { PROCESS_STEPS } from "@/lib/data";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import Arrow from "@/components/Arrow";
import Star from "@/components/Star";
import SectionConstellation from "@/components/SectionConstellation";

export default function Process() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
      if (!steps.length) return;

      steps.forEach((step, i) => {
        gsap.to(step, {
          scrollTrigger: {
            trigger: step,
            start: "top 55%",
            end: "bottom 55%",
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          },
        });
      });
    },
    { scope: root },
  );

  const progress = ((active + 1) / PROCESS_STEPS.length) * 100;

  return (
    <section
      id="process"
      ref={root}
      className="relative overflow-hidden bg-ivory py-20 md:py-28 lg:py-32"
    >
      <SectionConstellation tone="wine" opacity={0.025} />
      <div className="container-x relative z-10 mx-auto max-w-[1440px]">
        <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-2 text-wine">
              <Star className="h-2.5 w-2.5" />
              Как мы работаем
            </p>
            <h2 className="type-section-title font-display max-w-[16ch] font-semibold">
              От заявки до результата
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="type-body-sm max-w-[32ch] text-ink/60 md:text-right">
              Пять шагов — без сюрпризов в сроках, цене и коммуникации.
            </p>
          </Reveal>
        </div>

        {/* Фишка: прогресс дела */}
        <div className="mb-10 flex items-center gap-4 md:mb-12">
          <span className="type-label font-mono uppercase text-ink/40">
            Этап {String(active + 1).padStart(2, "0")} / 0{PROCESS_STEPS.length}
          </span>
          <div className="h-px flex-1 bg-ink/10">
            <div
              className="h-full bg-wine transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="type-label font-mono uppercase text-wine">
            {PROCESS_STEPS[active]?.title}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 xl:gap-20">
          <div className="relative lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="relative aspect-[3/4] overflow-hidden bg-ink">
                <Image
                  src="/images/columns.png"
                  alt="Классическая архитектура — символ устойчивости и права"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-transform duration-[1.4s] ease-out"
                  style={{
                    transform: `scale(${1 + active * 0.015})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="type-stat-step mb-4 font-display text-ivory/90">
                    {String(active + 1).padStart(2, "0")}
                  </p>
                  <MagneticButton
                    href="#contacts"
                    className="type-label h-12 w-full bg-ivory px-6 font-mono uppercase text-ink sm:w-auto"
                  >
                    Консультация
                    <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </MagneticButton>
                </div>
              </div>
            </Reveal>
          </div>

          <ol className="flex flex-col border-t border-ink/12">
            {PROCESS_STEPS.map((step, i) => {
              const isActive = active === i;
              return (
                <li
                  key={step.title}
                  data-step
                  className="border-b border-ink/12"
                >
                  <div
                    className={`grid grid-cols-[auto_1fr] items-start gap-5 py-6 transition-colors duration-500 md:grid-cols-[120px_1fr] md:gap-8 md:py-8 ${
                      isActive ? "bg-wine/[0.04]" : ""
                    }`}
                  >
                    <span
                      className={`type-stat-step font-display font-light transition-all duration-500 ${
                        isActive
                          ? "text-wine"
                          : "text-stroke-wine opacity-50"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="pt-1 md:pt-3">
                      <h3
                        className={`type-card-title font-display font-medium transition-colors duration-300 ${
                          isActive ? "text-wine" : "text-ink"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="type-body-sm mt-2 max-w-[38ch] text-ink/60">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
