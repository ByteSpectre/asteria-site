"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import RevealStagger from "@/components/RevealStagger";
import Arrow from "@/components/Arrow";
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
      <section className="border-t border-ink">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <ServiceBreadcrumb category={BANKRUPTCY_META.category} title={BANKRUPTCY_META.title} />
          </Reveal>

          <div className="grid gap-8 border-y border-ink pb-10 pt-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-16 lg:pb-16 lg:pt-10">
            <Reveal>
              <SectionEyebrow>{content.hero.eyebrow}</SectionEyebrow>
              <h1 className="service-hero-title max-w-[18ch] text-ink lg:max-w-[15ch]">
                {content.hero.title}
              </h1>
            </Reveal>

            <Reveal
              delay={0.08}
              className="flex min-w-0 flex-col justify-end border-t border-ink/15 pt-7 lg:border-t-0 lg:pt-0"
            >
              <ul className="space-y-4">
                {content.hero.promises.map((item) => (
                  <li key={item} className="flex gap-3 type-body-sm text-ink/75">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-wine" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <MessengerButton>{content.hero.cta}</MessengerButton>
              </div>
              <Link
                href={content.hero.softLink.href}
                className="type-body-sm mt-5 break-words text-ink/45 underline-offset-4 transition-colors hover:text-wine hover:underline"
              >
                {content.hero.softLink.label}
              </Link>
            </Reveal>
          </div>

          <Reveal>
            <p className="type-body-sm max-w-[72ch] py-6 text-ink/45 lg:py-7">
              {content.hero.disclaimer}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Почему мы</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[14ch]">
              Честные условия с первого дня
            </h2>
          </Reveal>

          <div className="mt-12 border-t border-ink/15 md:mt-16">
            <RevealStagger>
              {content.pillars.map((item, index) => (
                <article
                  key={item.title}
                  data-reveal-item
                  className="grid gap-3 border-b border-ink/15 py-7 text-left md:grid-cols-[4rem_minmax(12rem,0.85fr)_minmax(0,1.6fr)] md:items-start md:gap-8 md:py-8"
                >
                  <span className="type-label font-mono text-wine">{pad(index)}</span>
                  <h3 className="type-card-title font-display font-medium">{item.title}</h3>
                  <p className="type-body-sm max-w-[54ch] text-left text-ink/60">{item.text}</p>
                </article>
              ))}
            </RevealStagger>
          </div>
        </div>
      </section>

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
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end lg:gap-16">
            <Reveal>
              <SectionEyebrow light>После процедуры</SectionEyebrow>
              <h2 className="type-section-title font-display max-w-[14ch] text-ivory">
                Последствия банкротства
              </h2>
            </Reveal>

            <Reveal delay={0.08} className="lg:pb-1">
              <div className="border-l border-ivory/25 pl-5 sm:pl-7">
                <p className="type-label font-mono uppercase text-ivory/55">
                  После завершения процедуры
                </p>
                <p className="type-body-sm mt-4 max-w-[42ch] text-ivory/70">
                  {content.consequences.intro}
                </p>
              </div>
            </Reveal>
          </div>

          <div
            data-testid="consequence-cards"
            className="mt-12 bg-white text-ink md:mt-16"
          >
            {(() => {
              const groups = [
                {
                  kind: "freedom" as const,
                  label: content.consequences.freedomsLabel,
                  marker: "Можно",
                },
                {
                  kind: "limit" as const,
                  label: content.consequences.limitsLabel,
                  marker: "Сроки",
                },
              ];

              return (
                <>
                  <div className="grid border-b border-ink/10 lg:grid-cols-2">
                    {groups.map((group) => (
                      <div
                        key={group.kind}
                        className={`flex min-h-[3.5rem] items-center justify-between gap-6 px-5 py-5 sm:px-7 sm:py-6 lg:px-10 xl:px-12 ${
                          group.kind === "freedom" ? "lg:border-r lg:border-ink/10" : ""
                        }`}
                      >
                        <p className="type-label font-mono uppercase text-ink/45">{group.label}</p>
                        <span className="type-label shrink-0 border border-ink/15 px-3 py-1.5 font-mono uppercase text-ink/55">
                          {group.marker}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-2">
                    {groups.map((group) => (
                      <div
                        key={group.kind}
                        className={`bg-white px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10 xl:px-12 ${
                          group.kind === "freedom" ? "lg:border-r lg:border-ink/10" : ""
                        }`}
                      >
                        <RevealStagger className="grid gap-4">
                          {content.consequences.rows
                            .filter((row) => row.kind === group.kind)
                            .map((row) => (
                              <article
                                key={row.title}
                                data-reveal-item
                                className="group bg-white py-5 text-ink sm:py-6"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <p className="font-display text-[42px] leading-[1.1] !font-normal tracking-[-0.06em] text-ink whitespace-nowrap">
                                    {row.fact}
                                  </p>
                                  <p className="type-label shrink-0 text-right font-mono uppercase leading-none text-ink/45">
                                    {row.factLabel}
                                  </p>
                                </div>
                                <h3 className="type-card-title font-display mt-5 font-medium leading-[1.2] text-wine">
                                  {row.title}
                                </h3>
                                <p className="type-body-sm mt-3 max-w-[48ch] text-ink/65">{row.text}</p>
                              </article>
                            ))}
                        </RevealStagger>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>

          <Reveal>
            <div className="grid border-b border-ivory/20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-stretch">
              <div className="py-8 lg:pr-12 lg:py-10">
                <p className="type-label font-mono uppercase text-ivory/55">Важно знать до старта</p>
                <p className="type-body-sm mt-4 max-w-[72ch] text-ivory/65">
                  {content.consequences.reminder}
                </p>
              </div>

              <div className="flex flex-col items-start gap-5 border-t border-ivory/20 py-8 lg:min-w-[22rem] lg:justify-center lg:border-l lg:border-t-0 lg:py-10 lg:pl-10">
                <MessengerButton className="!bg-ivory !text-wine-deep hover:!bg-cream focus-visible:!ring-ivory focus-visible:!ring-offset-wine-deep">
                  Обсудить мою ситуацию
                </MessengerButton>
                <Link
                  href={content.consequences.article.href}
                  className="type-label group inline-flex min-h-11 items-center gap-2 font-mono uppercase text-ivory/60 transition-colors hover:text-ivory focus-visible:outline-ivory"
                >
                  {content.consequences.article.label}
                  <Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>База знаний</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[16ch]">
              {content.education.title}
            </h2>
          </Reveal>

          <ul className="mt-10 border-t border-ink/15 md:mt-14">
            {content.education.articles.map((title, index) => (
              <li key={title} className="border-b border-ink/15">
                <Link
                  href="/knowledge"
                  className="group grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-start gap-3 py-5 transition-colors hover:text-wine sm:items-center sm:gap-4 md:grid-cols-[4rem_minmax(0,1fr)_auto] md:gap-8 md:py-6"
                >
                  <span className="type-label font-mono text-ink/30 group-hover:text-wine/50">
                    {pad(index)}
                  </span>
                  <span className="type-service-title font-display font-medium">{title}</span>
                  <span className="type-label pt-1 font-mono uppercase text-ink/35 group-hover:text-wine sm:pt-0">
                    <span className="sm:hidden">→</span>
                    <span className="hidden sm:inline">Читать →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Reveal>
            <div className="mt-8 md:mt-10">
              <TextLink href={content.education.allHref}>Все статьи</TextLink>
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
