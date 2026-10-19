"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import LeadButton from "@/components/contact/LeadButton";
import { STATS } from "@/lib/data";

const HERO_STATS = [STATS[0], STATS[1]] as [
  (typeof STATS)[0],
  (typeof STATS)[1],
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const spotRaf = useRef(0);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // FOUC-prevention classes stay at opacity-0 unless we clear them.
        gsap.set(
          [
            "[data-hero-stat]",
            "[data-hero-cta]",
            "[data-hero-sub]",
            "[data-hero-scroll]",
            "[data-hero-line]",
            "[data-hero-image]",
            "[data-hero-veil]",
          ],
          { clearProps: "all", autoAlpha: 1, y: 0, yPercent: 0, scale: 1 },
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-hero-image]",
        { scale: 1.12 },
        { scale: 1, duration: 2.2, ease: "power2.out" },
        0,
      )
        .fromTo(
          "[data-hero-veil]",
          { opacity: 0.85 },
          { opacity: 1, duration: 1.4 },
          0,
        )
        .fromTo(
          "[data-hero-stat]",
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1 },
          0.3,
        )
        .fromTo(
          "[data-hero-line]",
          { y: "110%" },
          { y: "0%", duration: 1.15, stagger: 0.08 },
          0.5,
        )
        .fromTo(
          "[data-hero-sub]",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9 },
          0.95,
        )
        .fromTo(
          "[data-hero-cta]",
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.85 },
          1.1,
        )
        .fromTo(
          "[data-hero-scroll]",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6 },
          1.35,
        );

      // No scrub/parallax — continuous transform updates during scroll were janky.
      gsap.to("[data-hero-scroll]", {
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top -48",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: root },
  );

  const onMove = (e: MouseEvent) => {
    if (!root.current || !spot.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = root.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const el = spot.current;
    cancelAnimationFrame(spotRaf.current);
    spotRaf.current = requestAnimationFrame(() => {
      el.style.setProperty("--sx", `${x}%`);
      el.style.setProperty("--sy", `${y}%`);
      el.style.opacity = "1";
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(spotRaf.current);
    if (spot.current) spot.current.style.opacity = "0";
  };

  return (
    <section
      id="hero"
      ref={root}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-ivory"
    >
      <div className="absolute inset-0">
        <div data-hero-image className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Юрист в зале суда"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_30%]"
          />
        </div>
        <div
          data-hero-veil
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25"
        />
        {/* Фишка: луч прожектора следует за курсором */}
        <div
          ref={spot}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(420px circle at var(--sx, 50%) var(--sy, 40%), rgba(251,248,241,0.18), transparent 55%)",
          }}
        />
      </div>

      <div className="container-x relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1440px] flex-col justify-end pb-10 pt-28 md:pb-14 md:pt-32">
        <ul
          className="mb-14 flex flex-wrap gap-x-10 gap-y-6 md:mb-16 md:gap-x-14 lg:mb-20"
          aria-label="Ключевые показатели"
        >
          {HERO_STATS.map((stat) => (
            <li key={stat.label} data-hero-stat className="opacity-0">
              <p className="type-hero-stat font-display text-ivory">
                {stat.value}
                {stat.suffix}
              </p>
              <p className="type-hero-stat-label mt-2 max-w-[14ch] text-ivory/80">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h1 className="type-hero-title min-w-0">
            <span className="hero-line-mask">
              <span data-hero-line className="block will-change-transform">
                Защищаем в&nbsp;судах
              </span>
            </span>
            <span className="hero-line-mask">
              <span data-hero-line className="block will-change-transform">
                и&nbsp;сделках,
              </span>
            </span>
            <span className="hero-line-mask">
              <span data-hero-line className="block will-change-transform">
                сохраняем активы
              </span>
            </span>
          </h1>

          <div data-hero-cta className="flex shrink-0 flex-col gap-3 opacity-0 lg:items-end">
            <LeadButton className="type-label h-12 min-w-[220px] bg-ivory px-7 font-mono uppercase text-ink transition-colors duration-300 hover:bg-cream">
              Консультация
            </LeadButton>
          </div>
        </div>

        <p
          data-hero-sub
          className="type-hero-tagline mt-8 max-w-[40ch] text-ivory/85 opacity-0 md:mt-10 md:max-w-[48ch]"
        >
          Работаем по всей России — первая консультация бесплатно.
        </p>

        <a
          href="#about"
          data-hero-scroll
          className="type-micro mt-12 inline-flex items-center gap-3 font-mono uppercase text-ivory/45 opacity-0 transition-colors hover:text-ivory md:mt-16"
        >
          <span className="relative h-8 w-px overflow-hidden bg-ivory/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-line_1.6s_ease-in-out_infinite] bg-ivory/80" />
          </span>
          Листать дело
        </a>
      </div>
    </section>
  );
}
