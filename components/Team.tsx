"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { FEATURED_PARTNER, TEAM } from "@/lib/data";
import Reveal from "@/components/Reveal";
import Star from "@/components/Star";

function MemberCard({
  name,
  role,
  focus,
  photo,
  featured = false,
  photoOnly = false,
}: {
  name: string;
  role: string;
  focus: string;
  photo: string;
  featured?: boolean;
  photoOnly?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const img = el.querySelector<HTMLElement>("[data-img]");
    if (img) {
      img.style.transform = `scale(1.06) translate(${x * -10}px, ${y * -8}px)`;
    }
  };

  const onLeave = () => {
    const img = ref.current?.querySelector<HTMLElement>("[data-img]");
    if (img) img.style.transform = "";
  };

  return (
    <article
      className="group"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        ref={ref}
        className="relative aspect-[3/4] overflow-hidden bg-ink/5"
      >
        <div
          data-img
          className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
        >
          <Image
            src={photo}
            alt={name}
            fill
            sizes={featured || photoOnly ? "(max-width:1024px) 100vw, 42vw" : "(max-width:640px) 100vw, 33vw"}
            className="object-cover object-top"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {featured && (
          <span className="type-micro absolute top-4 left-4 border border-ink/10 bg-ivory/95 px-2.5 py-1 font-mono uppercase text-ink/70 backdrop-blur-sm">
            Partner
          </span>
        )}
      </div>

      {!photoOnly && (
        <>
          <div className="mt-4 border-b border-ink/12 pb-4">
            <h3 className="type-card-title font-display font-medium transition-colors duration-300 group-hover:text-wine">
              {name}
            </h3>
            <p className="mt-1 text-sm leading-snug text-ink/55">{focus}</p>
          </div>
          <p className="eyebrow mt-3 text-ink/40">{role}</p>
        </>
      )}
    </article>
  );
}

export default function Team() {
  return (
    <section id="team" className="relative overflow-hidden bg-cream py-20 md:py-28 lg:py-32">
      {/* Soft side atmosphere — not competing with text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-wine/[0.03] to-transparent"
      />

      <div className="container-x relative z-10 mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 border-b border-ink/10 pb-10 md:flex-row md:items-end md:justify-between md:pb-12">
          <Reveal>
            <p className="eyebrow mb-4 flex items-center gap-2 text-wine">
              <Star className="h-2.5 w-2.5" />
              Команда
            </p>
            <h2 className="type-section-title font-display max-w-[16ch] font-semibold">
              Эксперты, на которых можно положиться
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="type-body-sm max-w-[32ch] text-ink/55 md:text-right">
              Юристы Астерии — члены АЮР. Ведём дела лично, отвечаем за результат.
            </p>
          </Reveal>
        </div>

        {/* Featured partner — editorial split */}
        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          <Reveal className="lg:col-span-5">
            <MemberCard
              name={FEATURED_PARTNER.name}
              role={FEATURED_PARTNER.role}
              focus={FEATURED_PARTNER.focus}
              photo={FEATURED_PARTNER.photo}
              featured
              photoOnly
            />
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col justify-between lg:col-span-7">
            <div>
              <p className="eyebrow text-ink/40">{FEATURED_PARTNER.role}</p>
              <h3 className="type-feature-name font-display mt-3 font-semibold">
                {FEATURED_PARTNER.name}
              </h3>
              <p className="type-body mt-5 max-w-[40ch] text-ink/65">
                {FEATURED_PARTNER.focus}
              </p>
            </div>

            <div className="mt-10 grid gap-0 border border-ink/12 sm:grid-cols-2">
              {FEATURED_PARTNER.facts.map((fact, i) => (
                <div
                  key={fact.value}
                  className={`relative bg-ivory p-6 md:p-8 ${
                    i === 0 ? "sm:border-r border-ink/12" : ""
                  } ${i === FEATURED_PARTNER.facts.length - 1 ? "bg-wine text-ivory" : ""}`}
                >
                  <p
                    className={`type-stat font-display font-semibold ${
                      i === FEATURED_PARTNER.facts.length - 1 ? "text-ivory" : "text-wine"
                    }`}
                  >
                    {fact.value}
                  </p>
                  <p
                    className={`mt-3 max-w-[28ch] text-sm leading-relaxed ${
                      i === FEATURED_PARTNER.facts.length - 1
                        ? "text-ivory/70"
                        : "text-ink/55"
                    }`}
                  >
                    {fact.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 hidden items-center gap-3 lg:flex">
              <span className="h-px flex-1 bg-ink/10" />
              <span className="type-micro font-mono uppercase text-ink/35">
                Управляющий партнёр · АЮР
              </span>
            </div>
          </Reveal>
        </div>

        {/* Rest of team */}
        <div className="mt-16 border-t border-ink/10 pt-12 md:mt-20 md:pt-16">
          <Reveal>
            <div className="mb-8 flex items-baseline justify-between gap-4 md:mb-10">
              <p className="eyebrow text-ink/40">Вся практика</p>
              <p className="type-label font-mono uppercase text-ink/35">
                {String(TEAM.length).padStart(2, "0")} специалистов
              </p>
            </div>
          </Reveal>

          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member, i) => (
              <li key={member.name}>
                <Reveal delay={Math.min(i * 0.05, 0.2)}>
                  <MemberCard
                    name={member.name}
                    role={member.role}
                    focus={member.focus}
                    photo={member.photo}
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
