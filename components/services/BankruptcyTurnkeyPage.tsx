"use client";

import Link from "next/link";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import RevealStagger from "@/components/RevealStagger";
import SectionConstellation from "@/components/SectionConstellation";
import {
  BANKRUPTCY_CONTENT,
  BANKRUPTCY_META,
} from "@/lib/services/bankruptcy";
import {
  AccordionPanel,
  MessengerButton,
  ServiceBreadcrumb,
  ServicePageShell,
  SectionEyebrow,
  TextLink,
  pad,
} from "@/components/services/ui";

const content = BANKRUPTCY_CONTENT;

export default function BankruptcyTurnkeyPage() {
  const [openTrack, setOpenTrack] = useState(0);

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
                  className="grid gap-4 border-b border-ink/15 py-7 md:grid-cols-[4rem_minmax(12rem,0.85fr)_minmax(0,1.4fr)_auto] md:items-start md:gap-8 md:py-8"
                >
                  <span className="type-label font-mono text-wine">{pad(index)}</span>
                  <h3 className="type-card-title font-display font-medium">{item.title}</h3>
                  <p className="type-body-sm text-ink/60">{item.text}</p>
                  <div className="flex flex-col gap-3 md:items-end">
                    {item.links.map((link) => (
                      <TextLink key={link.label} href={link.href}>
                        {link.label}
                      </TextLink>
                    ))}
                  </div>
                </article>
              ))}
            </RevealStagger>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-wine py-16 text-ivory sm:py-20 md:py-28">
        <SectionConstellation tone="ivory" opacity={0.055} />
        <div className="container-x relative z-10 mx-auto max-w-[1440px]">
          <Reveal>
            <p className="type-label font-mono uppercase text-ivory/45">Суть</p>
            <h2 className="type-section-title font-display mt-5 max-w-[16ch]">
              {content.manifesto.quote}
            </h2>
            <p className="type-body mt-6 max-w-[40ch] text-ivory/70">{content.manifesto.text}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <MessengerButton className="bg-ivory text-wine">Получить консультацию</MessengerButton>
              <TextLink href={content.manifesto.guide.href} light>
                {content.manifesto.guide.label}
              </TextLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          <Reveal>
            <SectionEyebrow>Наши услуги</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[12ch]">
              Три сценария защиты
            </h2>
            <p className="type-body-sm mt-5 max-w-[30ch] text-ink/55">
              Выберите ситуацию — откроем состав работ и следующие шаги.
            </p>
          </Reveal>

          <div className="border-t border-ink/15">
            {content.tracks.map((track, index) => {
              const open = openTrack === index;
              return (
                <article key={track.title} className="border-b border-ink/15">
                  <button
                    type="button"
                    onClick={() => setOpenTrack(open ? -1 : index)}
                    className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)_1.5rem] items-start gap-x-3 py-6 text-left outline-none transition-colors hover:text-wine focus-visible:bg-ivory focus-visible:text-wine sm:grid-cols-[2.75rem_minmax(0,1fr)_1.5rem] sm:gap-x-4 md:grid-cols-[4rem_minmax(0,1fr)_1.5rem] md:gap-x-8 md:py-7"
                    aria-expanded={open}
                  >
                    <span className="type-label font-mono text-ink/35">{pad(index)}</span>
                    <h3 className="type-service-title font-display font-medium">{track.title}</h3>
                    <span className="type-label text-center text-ink/45">{open ? "−" : "+"}</span>
                  </button>
                  <AccordionPanel
                    open={open}
                    className="max-w-[54ch] pb-8 pl-[calc(2.5rem+0.75rem)] sm:pl-[calc(2.75rem+1rem)] md:pl-[calc(4rem+2rem)]"
                  >
                    <ul className="space-y-3">
                      {track.actions.map((action) => (
                        <li key={action} className="flex gap-3 type-body-sm text-ink/65">
                          <span className="mt-2 h-1 w-1 shrink-0 bg-wine" aria-hidden />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                    {track.note ? (
                      <p className="type-body-sm mt-5 border-l-2 border-wine/30 pl-4 text-ink/50">
                        {track.note}
                      </p>
                    ) : null}
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
                      {track.links.map((link) => (
                        <TextLink key={link.label} href={link.href}>
                          {link.label}
                        </TextLink>
                      ))}
                    </div>
                  </AccordionPanel>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-ivory py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <SectionEyebrow>Последствия</SectionEyebrow>
              <h2 className="type-section-title font-display max-w-[14ch]">
                Что меняется после процедуры
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="type-body-sm max-w-[34ch] text-ink/55 md:text-right">
                {content.consequences.intro}
              </p>
            </Reveal>
          </div>

          <div className="border-t border-ink/15">
            <RevealStagger>
              {content.consequences.rows.map((row, index) => (
                <article
                  key={row.title}
                  data-reveal-item
                  className="grid gap-3 border-b border-ink/15 py-7 md:grid-cols-[minmax(12rem,0.9fr)_minmax(0,1.4fr)] md:gap-12 md:py-8"
                >
                  <div>
                    <span className="type-label font-mono text-ink/30">{pad(index)}</span>
                    <h3 className="type-card-title font-display mt-3 font-medium">{row.title}</h3>
                  </div>
                  <p className="type-body-sm text-ink/60 md:pt-7">{row.text}</p>
                </article>
              ))}
            </RevealStagger>
          </div>

          <Reveal>
            <p className="type-body-sm mt-8 max-w-[70ch] text-ink/45">{content.consequences.reminder}</p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <MessengerButton>Спросить юриста о вашей ситуации</MessengerButton>
              <TextLink href={content.consequences.article.href}>
                {content.consequences.article.label}
              </TextLink>
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
