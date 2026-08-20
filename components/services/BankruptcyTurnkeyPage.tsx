"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import RevealStagger from "@/components/RevealStagger";
import Arrow from "@/components/Arrow";
import Star from "@/components/Star";
import MagneticButton from "@/components/MagneticButton";
import BankruptcyTracksFolder from "@/components/services/BankruptcyTracksFolder";
import {
  BANKRUPTCY_CONTENT,
  BANKRUPTCY_META,
} from "@/lib/services/bankruptcy";
import {
  MessengerButton,
  ServiceBreadcrumb,
  ServicePageShell,
  SectionEyebrow,
  TextLink,
  pad,
} from "@/components/services/ui";

const content = BANKRUPTCY_CONTENT;

export default function BankruptcyTurnkeyPage() {
  return (
    <ServicePageShell>
      {/* 1. Hero */}
      <section className="border-t border-ink">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <ServiceBreadcrumb category={BANKRUPTCY_META.category} title={BANKRUPTCY_META.title} />
          </Reveal>

          <div className="grid gap-0 border-y border-ink lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)]">
            <Reveal className="flex flex-col justify-center gap-6 pb-10 pt-8 lg:gap-8 lg:pb-16 lg:pr-16 lg:pt-12">
              <SectionEyebrow>{content.hero.eyebrow}</SectionEyebrow>
              <h1 className="service-hero-title max-w-[15ch] text-ink">
                {content.hero.title}
              </h1>
              <div className="pt-1">
                <MessengerButton>{content.hero.cta}</MessengerButton>
              </div>
              <Link
                href={content.hero.softLink.href}
                className="type-body-sm break-words text-ink/45 underline-offset-4 transition-colors hover:text-wine hover:underline"
              >
                {content.hero.softLink.label}
              </Link>
            </Reveal>

            <Reveal
              delay={0.08}
              className="flex flex-col justify-center gap-8 border-t border-ink/15 bg-wine px-6 py-9 text-ivory sm:px-8 sm:py-10 lg:border-l lg:border-t-0 lg:border-ink lg:px-10 lg:py-16"
            >
              <p className="type-label font-mono uppercase text-ivory/50">Что получите</p>
              <ul className="space-y-4">
                {content.hero.promises.map((item) => (
                  <li key={item} className="flex gap-3 type-body-sm text-ivory/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-ivory/60" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="type-label font-mono uppercase text-ivory/40">
                Рассрочка · от 16 900 ₽/мес
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. Pillars — same pattern as template services */}
      <section className="bg-cream py-16 sm:py-20 md:py-28 lg:py-32">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Почему мы</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[14ch]">
              Честные условия с первого дня
            </h2>
          </Reveal>

          {/* Mobile timeline */}
          <div className="relative mt-12 md:hidden">
            <div aria-hidden className="absolute top-2 bottom-2 left-5 w-px bg-wine/20" />
            <div className="space-y-8">
              {content.pillars.map((item, index) => {
                const last = index === content.pillars.length - 1;
                return (
                  <Reveal key={item.title} delay={index * 0.05}>
                    <article className="relative pl-16">
                      <span
                        className={`type-label absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-full font-mono ${
                          last
                            ? "border border-wine bg-wine text-ivory"
                            : "border border-wine/30 bg-cream text-wine"
                        }`}
                      >
                        {last ? <Star className="h-3.5 w-3.5" /> : pad(index)}
                      </span>
                      <h3 className="type-card-title font-display font-medium text-ink">
                        {item.title}
                      </h3>
                      <p className="type-body-sm mt-2 max-w-[34ch] text-ink/60">{item.text}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Desktop quadrants */}
          <div className="relative mt-16 hidden md:block">
            <div aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-wine/20" />
            <div aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-wine/20" />

            <div className="grid grid-cols-2">
              {content.pillars.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.06}>
                  <article
                    className={`relative flex min-h-[250px] overflow-hidden lg:min-h-[290px] ${
                      index === 0
                        ? "items-start justify-start pr-20 pb-16"
                        : index === 1
                          ? "items-start justify-end pb-16 pl-20 text-right"
                          : index === 2
                            ? "items-end justify-start pt-16 pr-20"
                            : "items-end justify-end pt-16 pl-20 text-right"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute font-display text-[8rem] leading-none tracking-[-0.08em] text-wine/[0.06] lg:text-[10rem] ${
                        index % 2 === 0 ? "left-0" : "right-0"
                      } ${index < 2 ? "top-0" : "bottom-0"}`}
                    >
                      {index + 1}
                    </span>
                    <div className="relative z-10 max-w-[25rem]">
                      <span className="type-label font-mono uppercase text-wine/55">
                        Пункт {pad(index)}
                      </span>
                      <h3 className="type-card-title font-display mt-4 font-medium text-ink">
                        {item.title}
                      </h3>
                      <p className={`type-body-sm mt-3 text-ink/60 ${index % 2 ? "ml-auto" : ""}`}>
                        {item.text}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <div
              aria-hidden
              className="absolute top-1/2 left-1/2 z-20 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-wine text-ivory shadow-[0_0_0_12px_var(--color-cream)] lg:h-40 lg:w-40"
            >
              <Star className="h-7 w-7 text-ivory/90 lg:h-9 lg:w-9" />
              <span className="type-micro mt-3 font-mono uppercase tracking-[0.12em] text-ivory/55">
                Астерия
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Manifesto */}
      <section className="relative overflow-hidden py-16 text-ivory sm:py-20 md:py-28">
        <Image
          src="/images/bankruptcy-essence-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
        <div className="container-x relative z-10 mx-auto max-w-[1440px]">
          <Reveal>
            <p className="type-label font-mono uppercase text-ivory/55">Суть</p>
            <h2 className="type-section-title font-display mt-5 max-w-[16ch] text-left">
              {content.manifesto.quote}
            </h2>
            <p className="type-body mt-6 max-w-[40ch] text-left text-ivory/75">
              {content.manifesto.text}
            </p>
            <div className="mt-10 flex flex-col items-start gap-4">
              <MagneticButton
                href={content.manifesto.guide.href}
                className="type-label h-12 min-w-[200px] border border-ivory/40 bg-transparent px-7 font-mono uppercase text-ivory transition-colors duration-300 hover:border-ivory hover:bg-ivory/10"
              >
                {content.manifesto.guide.label}
                <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      <BankruptcyTracksFolder tracks={content.tracks} />

      {/* 4. Consequences — 4 vertical cards */}
      <section
        id="posledstviya"
        data-testid="bankruptcy-consequences"
        className="relative overflow-hidden bg-wine-deep py-16 text-ivory sm:py-20 md:py-28"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(251,248,241,0.035) 1px, transparent 1px)",
            backgroundSize: "clamp(5rem, 9vw, 10rem) 100%",
          }}
        />

        <div className="container-x relative mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow light>После процедуры</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[14ch] text-ivory">
              {content.consequences.title}
            </h2>
            <p className="type-body-sm mt-5 max-w-[46ch] text-ivory/60">
              {content.consequences.lead}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-px bg-ivory/15 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
            {content.consequences.rows.map((row, index) => (
              <Reveal key={row.title} delay={index * 0.05}>
                <article className="flex h-full min-h-[16rem] flex-col justify-between gap-8 bg-wine-deep px-6 py-8 sm:px-7 sm:py-9">
                  <span className="type-label font-mono text-ivory/35">{pad(index)}</span>
                  <div>
                    <h3 className="type-card-title font-display font-medium leading-[1.2] text-ivory">
                      {row.title}
                    </h3>
                    <p className="type-body-sm mt-4 text-ivory/60">{row.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-12 flex flex-col gap-6 border-t border-ivory/15 pt-8 sm:flex-row sm:items-center sm:gap-8 md:mt-16 md:pt-10">
              <MessengerButton className="!bg-ivory !text-wine-deep hover:!bg-cream focus-visible:!ring-ivory focus-visible:!ring-offset-wine-deep">
                {content.consequences.cta}
              </MessengerButton>
              <TextLink href={content.consequences.article.href} light>
                {content.consequences.article.label}
              </TextLink>
            </div>
            <p className="type-body-sm mt-8 max-w-[64ch] border-l-2 border-ivory/25 pl-5 text-ivory/55 sm:pl-7">
              {content.consequences.warning}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 5. Education */}
      <section className="relative overflow-hidden bg-ink py-16 text-ivory sm:py-20 md:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(251,248,241,0.04) 1px, transparent 1px)",
            backgroundSize: "clamp(5rem, 9vw, 10rem) 100%",
          }}
        />
        <div className="container-x relative z-10 mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow light>База знаний</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[16ch] text-ivory">
              {content.education.title}
            </h2>
          </Reveal>

          <ul className="mt-12 border-t border-ivory/15 md:mt-16">
            <RevealStagger>
              {content.education.articles.map((title, index) => (
                <li key={title} data-reveal-item className="border-b border-ivory/15">
                  <Link
                    href="/knowledge"
                    className="group grid grid-cols-[3rem_minmax(0,1fr)_auto] items-start gap-3 py-6 transition-colors sm:items-center sm:gap-5 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:gap-10 md:py-8"
                  >
                    <span className="type-stat font-display text-ivory/25 transition-colors duration-300 group-hover:text-ivory/55">
                      {pad(index)}
                    </span>
                    <span className="type-service-title font-display font-medium text-ivory transition-colors duration-300 group-hover:text-ivory">
                      {title}
                    </span>
                    <span className="type-label inline-flex items-center gap-2 pt-1 font-mono uppercase text-ivory/35 transition-colors duration-300 group-hover:text-ivory sm:pt-0">
                      <span className="sm:hidden">→</span>
                      <span className="hidden sm:inline">Читать →</span>
                    </span>
                  </Link>
                </li>
              ))}
            </RevealStagger>
          </ul>

          <Reveal>
            <div className="mt-10 pt-8 md:mt-12 md:pt-10">
              <TextLink href={content.education.allHref} light>
                Все статьи
              </TextLink>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="border-t border-ink/10 bg-ivory">
        <div className="container-x mx-auto flex max-w-[1440px] items-center justify-between py-7">
          <span className="type-label truncate pr-4 font-mono uppercase text-ink/40">
            {BANKRUPTCY_META.title}
          </span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="type-label shrink-0 cursor-pointer font-mono uppercase text-ink/45 outline-none transition-colors hover:text-wine focus-visible:text-wine focus-visible:underline"
          >
            Наверх ↑
          </button>
        </div>
      </div>
    </ServicePageShell>
  );
}
