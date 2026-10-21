"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { PROCESS_STEPS } from "@/lib/data";
import Reveal from "@/components/Reveal";
import LeadButton from "@/components/contact/LeadButton";
import Star from "@/components/Star";
import SectionConstellation from "@/components/SectionConstellation";

/**
 * Active step is updated via DOM (not React setState) so ScrollTrigger
 * callbacks don't re-render the sticky Image tree while scrolling.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
      if (!steps.length) return;

      let active = 0;

      const applyActive = (index: number) => {
        if (index === active) return;
        active = index;

        steps.forEach((step, i) => {
          const on = i === index;
          step.dataset.active = on ? "true" : "false";
          const num = step.querySelector<HTMLElement>("[data-step-num]");
          const heading = step.querySelector<HTMLElement>("[data-step-title]");
          if (num) {
            num.classList.toggle("text-wine", on);
            num.classList.toggle("text-stroke-wine", !on);
            num.classList.toggle("opacity-50", !on);
          }
          if (heading) {
            heading.classList.toggle("text-wine", on);
            heading.classList.toggle("text-ink", !on);
          }
          const row = step.querySelector<HTMLElement>("[data-step-row]");
          if (row) {
            row.style.backgroundColor = on ? "rgba(67, 28, 38, 0.04)" : "";
          }
        });

        const progress = ((index + 1) / PROCESS_STEPS.length) * 100;
        if (progressRef.current) {
          progressRef.current.style.width = `${progress}%`;
        }
        if (stageRef.current) {
          stageRef.current.textContent = `Этап ${String(index + 1).padStart(2, "0")} / 0${PROCESS_STEPS.length}`;
        }
        if (titleRef.current) {
          titleRef.current.textContent = PROCESS_STEPS[index]?.title ?? "";
        }
        const badge = root.current?.querySelector<HTMLElement>("[data-step-badge]");
        if (badge) {
          badge.textContent = String(index + 1).padStart(2, "0");
        }
        // Avoid CSS transition on large Image during scroll — set instantly.
        if (imageRef.current) {
          imageRef.current.style.transform = `scale(${1 + index * 0.015})`;
        }
      };

      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => applyActive(i),
          onEnterBack: () => applyActive(i),
        });
      });

      applyActive(0);
    },
    { scope: root },
  );

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
            <h2 className="type-section-title font-display max-w-[16ch]">
              От заявки до результата
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="type-body-sm max-w-[32ch] text-ink/60 md:text-right">
              Пять шагов — без сюрпризов в сроках, цене и коммуникации.
            </p>
          </Reveal>
        </div>

        <div className="mb-10 flex items-center gap-4 md:mb-12">
          <span
            ref={stageRef}
            className="type-label font-mono uppercase text-ink/40"
          >
            Этап 01 / 0{PROCESS_STEPS.length}
          </span>
          <div className="h-px flex-1 bg-ink/10">
            <div
              ref={progressRef}
              className="h-full bg-wine"
              style={{ width: `${(1 / PROCESS_STEPS.length) * 100}%` }}
            />
          </div>
          <span
            ref={titleRef}
            className="type-label font-mono uppercase text-wine"
          >
            {PROCESS_STEPS[0]?.title}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 xl:gap-20">
          <div className="relative lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="relative aspect-[3/4] overflow-hidden bg-ink">
                <Image
                  ref={imageRef}
                  src="/images/columns.jpg"
                  alt="Классическая архитектура — символ устойчивости и права"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover will-change-transform"
                  style={{ transform: "scale(1)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p
                    data-step-badge
                    className="type-stat-step mb-4 font-display text-ivory/90"
                  >
                    01
                  </p>
                  <LeadButton className="type-label h-12 w-full bg-ivory px-6 font-mono uppercase text-ink sm:w-auto">
                    Консультация
                  </LeadButton>
                </div>
              </div>
            </Reveal>
          </div>

          <ol className="flex flex-col border-t border-ink/12">
            {PROCESS_STEPS.map((step, i) => (
              <li
                key={step.title}
                data-step
                data-active={i === 0 ? "true" : "false"}
                className="border-b border-ink/12"
              >
                <div
                  data-step-row
                  className={`grid grid-cols-[auto_1fr] items-start gap-5 py-6 md:grid-cols-[120px_1fr] md:gap-8 md:py-8 ${
                    i === 0 ? "bg-wine/[0.04]" : ""
                  }`}
                >
                  <span
                    data-step-num
                    className={`type-stat-step font-display ${
                      i === 0 ? "text-wine" : "text-stroke-wine opacity-50"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1 md:pt-3">
                    <h3
                      data-step-title
                      className={`type-card-title font-display font-medium ${
                        i === 0 ? "text-wine" : "text-ink"
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
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
