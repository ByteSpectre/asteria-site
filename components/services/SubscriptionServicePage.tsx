"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import RevealStagger from "@/components/RevealStagger";
import ContactSky from "@/components/ContactSky";
import {
  SUBSCRIPTION_CONTENT,
  SUBSCRIPTION_META,
} from "@/lib/services/subscription";
import {
  AccordionPanel,
  MessengerButton,
  ServiceBreadcrumb,
  ServicePageShell,
  SectionEyebrow,
  TextLink,
  pad,
} from "@/components/services/ui";

const content = SUBSCRIPTION_CONTENT;

/**
 * Subject: Asteria legal hours retainer for business.
 * Job: pick an hours package and message us.
 * Signature: page as a monthly hours register — hairline ledgers,
 * wine decision plane for packages, quiet support sections after.
 */
export default function SubscriptionServicePage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <ServicePageShell>
      {/* 1. Hero */}
      <section className="border-t border-ink bg-cream">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <ServiceBreadcrumb
              category={SUBSCRIPTION_META.category}
              title={SUBSCRIPTION_META.title}
            />
          </Reveal>

          <div className="grid gap-0 border-y border-ink lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)]">
            <Reveal className="flex flex-col justify-center gap-6 pb-10 pt-8 lg:gap-8 lg:pb-16 lg:pr-16 lg:pt-12">
              <SectionEyebrow>{content.hero.eyebrow}</SectionEyebrow>
              <h1 className="service-hero-title max-w-[15ch] text-ink">
                {content.hero.title}
              </h1>
              <p className="type-body max-w-[40ch] text-ink/65">{content.hero.text}</p>
              <div className="pt-1">
                <MessengerButton>{content.hero.cta}</MessengerButton>
              </div>
            </Reveal>

            <Reveal
              delay={0.08}
              className="flex flex-col justify-between gap-10 border-t border-ink/15 bg-wine px-6 py-9 text-ivory sm:px-8 sm:py-10 lg:border-l lg:border-t-0 lg:border-ink lg:px-10 lg:py-16"
            >
              <div>
                <p className="type-label font-mono uppercase text-ivory/50">Бонус</p>
                <p className="type-card-title font-display mt-4 font-medium leading-[1.3] text-ivory">
                  {content.hero.bonus}
                </p>
              </div>
              <p className="type-label font-mono uppercase text-ivory/40">
                Ставка · 5 000 ₽/ч
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. Comparison — contract verdict stamps */}
      <section className="bg-cream py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Сравнение</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[16ch]">
              {content.comparison.title}
            </h2>
            <p className="type-body-sm mt-5 max-w-[42ch] text-ink/55">
              {content.comparison.lead}
            </p>
          </Reveal>

          {/* Desktop */}
          <div className="mt-12 hidden md:mt-16 md:block">
            <div className="grid grid-cols-[minmax(0,1fr)_7.5rem_9.5rem] items-end gap-x-8 border-b border-ink pb-4 lg:grid-cols-[minmax(0,1fr)_8rem_11rem] lg:gap-x-12">
              <p className="type-label font-mono uppercase text-ink/30">Критерий</p>
              <p className="type-label text-center font-mono uppercase text-wine">
                {content.comparison.productLabel}
              </p>
              <p className="type-label text-center font-mono uppercase text-ink/35">
                {content.comparison.competitorLabel}
              </p>
            </div>

            <RevealStagger>
              {content.comparison.rows.map((row) => (
                <div
                  key={row.feature}
                  data-reveal-item
                  className="grid grid-cols-[minmax(0,1fr)_7.5rem_9.5rem] items-center gap-x-8 border-b border-ink/12 py-5 lg:grid-cols-[minmax(0,1fr)_8rem_11rem] lg:gap-x-12 lg:py-6"
                >
                  <p className="type-body-sm max-w-[52ch] text-ink/75">{row.feature}</p>

                  <div className="flex justify-center">
                    <span className="sr-only">Есть в абонементе</span>
                    <span
                      className="flex h-11 w-11 items-center justify-center bg-wine text-ivory lg:h-12 lg:w-12"
                      aria-hidden
                    >
                      <svg width="14" height="11" viewBox="0 0 12 10" fill="none">
                        <path
                          d="M1 5.2 4.2 8.5 11 1.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                      </svg>
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <span className="sr-only">Нет у штатного юриста</span>
                    <span
                      className="type-label font-mono text-ink/30"
                      aria-hidden
                    >
                      —
                    </span>
                  </div>
                </div>
              ))}
            </RevealStagger>
          </div>

          {/* Mobile */}
          <div className="mt-10 md:hidden">
            <div className="mb-4 flex items-center justify-end gap-6 border-b border-ink pb-3">
              <p className="type-label font-mono uppercase text-wine">
                {content.comparison.productLabel}
              </p>
              <p className="type-label font-mono uppercase text-ink/35">
                {content.comparison.competitorLabel}
              </p>
            </div>
            {content.comparison.rows.map((row) => (
              <article
                key={row.feature}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-ink/12 py-5"
              >
                <p className="type-body-sm text-ink/75">{row.feature}</p>
                <div className="flex items-center gap-6">
                  <span className="sr-only">
                    {content.comparison.productLabel}: да.{" "}
                    {content.comparison.competitorLabel}: нет.
                  </span>
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center bg-wine text-ivory"
                    aria-hidden
                  >
                    <svg width="13" height="10" viewBox="0 0 12 10" fill="none">
                      <path
                        d="M1 5.2 4.2 8.5 11 1.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                    </svg>
                  </span>
                  <span className="type-label w-10 text-center font-mono text-ink/30" aria-hidden>
                    —
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Advantages */}
      <section className="bg-cream py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Преимущества</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[12ch]">
              Наши преимущества
            </h2>
          </Reveal>

          <div className="mt-12 border-t border-ink/15 md:mt-16">
            <RevealStagger>
              {content.advantages.map((item, index) => (
                <article
                  key={item.title}
                  data-reveal-item
                  className="grid gap-3 border-b border-ink/15 py-7 md:grid-cols-[4rem_minmax(12rem,0.9fr)_minmax(0,1.5fr)] md:items-start md:gap-8 md:py-8"
                >
                  <span className="type-label font-mono text-wine">{pad(index)}</span>
                  <h3 className="type-card-title font-display font-medium">{item.title}</h3>
                  <p className="type-body-sm max-w-[52ch] text-ink/60">{item.text}</p>
                </article>
              ))}
            </RevealStagger>
          </div>
        </div>
      </section>

      {/* 4. Audience */}
      <section className="relative overflow-hidden bg-wine-deep py-16 text-ivory sm:py-20 md:py-28">
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
            <SectionEyebrow light>Аудитория</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[14ch]">
              Кому подойдёт абонемент
            </h2>
          </Reveal>

          <RevealStagger className="mt-12 grid gap-px bg-ivory/15 sm:grid-cols-2 md:mt-16">
            {content.audience.map((item) => (
              <article
                key={item.title}
                data-reveal-item
                className="bg-wine-deep px-6 py-8 sm:px-8 sm:py-10"
              >
                <h3 className="type-card-title font-display font-medium text-ivory">
                  {item.title}
                </h3>
                <p className="type-body-sm mt-4 max-w-[36ch] text-ivory/60">{item.text}</p>
              </article>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* 5. Inclusions */}
      <section className="bg-ivory py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Наполнение</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[14ch]">
              {content.inclusions.title}
            </h2>
            <p className="type-body-sm mt-5 max-w-[48ch] text-ink/55">{content.inclusions.lead}</p>
          </Reveal>

          <div className="mt-10 border-t border-ink md:mt-14">
            <div className="hidden grid-cols-[minmax(0,1fr)_7rem] gap-8 border-b border-ink/15 py-4 md:grid">
              <span className="type-label font-mono uppercase text-ink/35">Услуга</span>
              <span className="type-label text-right font-mono uppercase text-ink/35">
                Время
              </span>
            </div>
            <RevealStagger>
              {content.inclusions.rows.map((row) => (
                <div
                  key={row.service}
                  data-reveal-item
                  className="grid gap-2 border-b border-ink/15 py-5 md:grid-cols-[minmax(0,1fr)_7rem] md:items-baseline md:gap-8 md:py-6"
                >
                  <p className="type-body-sm text-ink/80">{row.service}</p>
                  <p className="type-label font-mono uppercase tabular-nums text-wine md:text-right md:text-ink/70">
                    {row.time}
                  </p>
                </div>
              ))}
            </RevealStagger>
          </div>
          <p className="type-body-sm mt-5 text-ink/45">{content.inclusions.note}</p>
        </div>
      </section>

      {/* 6. Packages — decision plane */}
      <section
        id="packages"
        className="scroll-mt-24 bg-wine py-16 text-ivory sm:py-20 md:py-28"
      >
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow light>Пакеты</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[12ch]">
              {content.packages.title}
            </h2>
            <p className="type-body-sm mt-5 max-w-[46ch] text-ivory/55">
              {content.packages.lead}
            </p>
          </Reveal>

          <div className="mt-12 flex flex-col gap-px bg-ivory/20 md:mt-16">
            {content.packages.items.map((pack, index) => {
              const featured = pack.featured;
              return (
                <Reveal key={pack.id} delay={index * 0.05}>
                  <article
                    className={
                      featured
                        ? "bg-ivory text-ink"
                        : "bg-wine-deep text-ivory"
                    }
                  >
                    <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                      <div className="flex flex-col justify-between gap-10 px-6 py-9 sm:px-8 sm:py-11 lg:px-12 lg:py-14">
                        <div>
                          <div className="flex items-baseline justify-between gap-4">
                            <p
                              className={`eyebrow ${
                                featured ? "text-wine" : "text-ivory/50"
                              }`}
                            >
                              {featured ? "Рекомендуем" : pad(index)}
                            </p>
                            <p
                              className={`type-label font-mono tabular-nums ${
                                featured ? "text-ink/40" : "text-ivory/45"
                              }`}
                            >
                              {pack.hours}
                            </p>
                          </div>
                          <h3 className="font-display mt-6 text-[clamp(1.875rem,2.6vw,2.75rem)] leading-none font-medium tracking-[-0.045em]">
                            {pack.name}
                          </h3>
                          <p className="mt-5 font-display text-[clamp(2.125rem,3.2vw,3rem)] leading-none tracking-[-0.05em]">
                            {pack.price}
                            <span
                              className={`type-label ml-2 align-middle font-mono uppercase ${
                                featured ? "text-ink/40" : "text-ivory/40"
                              }`}
                            >
                              / мес
                            </span>
                          </p>
                          <p
                            className={`type-body-sm mt-5 max-w-[32ch] ${
                              featured ? "text-ink/55" : "text-ivory/55"
                            }`}
                          >
                            {pack.forWhom}
                          </p>
                        </div>
                        <MessengerButton
                          serviceName={pack.name}
                          className={
                            featured
                              ? "!bg-wine !text-ivory hover:!bg-wine-deep"
                              : "!bg-ivory !text-wine hover:!bg-cream"
                          }
                        >
                          Выбрать пакет
                        </MessengerButton>
                      </div>

                      <div
                        className={`flex flex-col justify-center border-t px-6 py-9 sm:px-8 sm:py-11 lg:border-l lg:border-t-0 lg:px-12 lg:py-14 ${
                          featured ? "border-ink/10" : "border-ivory/12"
                        }`}
                      >
                        <p
                          className={`type-label mb-4 font-mono uppercase ${
                            featured ? "text-ink/35" : "text-ivory/40"
                          }`}
                        >
                          Примерное наполнение
                        </p>
                        <p
                          className={`type-body-sm max-w-[44ch] ${
                            featured ? "text-ink/65" : "text-ivory/65"
                          }`}
                        >
                          {pack.examples}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Long-term */}
      <section className="bg-cream py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Долгосрочно</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[16ch]">
              {content.longTerm.title}
            </h2>
            <p className="type-body-sm mt-5 max-w-[46ch] text-ink/55">{content.longTerm.lead}</p>
            <p className="type-label mt-5 font-mono uppercase text-wine">
              {content.longTerm.exampleLabel}
            </p>
          </Reveal>

          <div className="mt-10 border-t border-ink md:mt-14">
            <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] gap-8 border-b border-ink/15 py-4 sm:grid">
              <span className="type-label font-mono uppercase text-ink/35">Срок</span>
              <span className="type-label font-mono uppercase text-ink/35">
                Скидка / бонус
              </span>
              <span className="type-label font-mono uppercase text-ink/35">Цена / мес</span>
            </div>
            <RevealStagger>
              {content.longTerm.rows.map((row) => (
                <div
                  key={row.term}
                  data-reveal-item
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-ink/15 py-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] sm:items-center sm:gap-8 md:py-8"
                >
                  <p className="type-stat font-display text-[clamp(1.5rem,2vw,2.25rem)]">
                    {row.term}
                  </p>
                  <p className="type-body-sm col-span-2 text-ink/55 sm:col-span-1 sm:col-start-2">
                    {row.bonus}
                  </p>
                  <p className="type-card-title font-display text-right font-medium text-ink sm:col-start-3">
                    {row.price}
                  </p>
                </div>
              ))}
            </RevealStagger>
          </div>

          <Reveal>
            <p className="type-body-sm mt-8 max-w-[52ch] border-l-2 border-wine pl-5 text-ink/70 sm:pl-7">
              {content.longTerm.highlight}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 8. Savings */}
      <section className="bg-ivory py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Экономия</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[16ch]">
              {content.savings.title}
            </h2>
            <p className="type-body-sm mt-5 max-w-[46ch] text-ink/55">{content.savings.lead}</p>
          </Reveal>

          <div className="mt-10 hidden border-t border-ink md:mt-14 md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-ink/15">
                  <th className="type-label py-4 pr-6 font-mono font-normal uppercase text-ink/35">
                    Услуга
                  </th>
                  <th className="type-label py-4 pr-6 font-mono font-normal uppercase text-ink/35">
                    Разовая цена
                  </th>
                  <th className="type-label py-4 font-mono font-normal uppercase text-ink/35">
                    В пакете (8 ч)
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.savings.rows.map((row) => (
                  <tr key={row.service} className="border-b border-ink/10">
                    <td className="type-body-sm py-6 pr-6 text-ink/80">{row.service}</td>
                    <td className="type-body-sm py-6 pr-6 tabular-nums text-ink/45">
                      {row.oneOff}
                    </td>
                    <td className="type-body-sm py-6 font-medium tabular-nums text-ink">
                      {row.inPackage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 border-t border-ink md:hidden">
            {content.savings.rows.map((row) => (
              <article key={row.service} className="border-b border-ink/15 py-5">
                <h3 className="type-card-title font-display font-medium">{row.service}</h3>
                <dl className="mt-4 grid grid-cols-2 gap-6">
                  <div>
                    <dt className="type-label font-mono uppercase text-ink/35">Разово</dt>
                    <dd className="type-body-sm mt-1 tabular-nums text-ink/70">{row.oneOff}</dd>
                  </div>
                  <div>
                    <dt className="type-label font-mono uppercase text-wine">В пакете</dt>
                    <dd className="type-body-sm mt-1 tabular-nums text-ink/80">{row.inPackage}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="mt-8 grid border border-ink sm:grid-cols-3">
            <div className="border-b border-ink/10 bg-cream px-6 py-7 sm:border-b-0 sm:border-r sm:border-ink/10 md:px-8 md:py-9">
              <p className="type-label font-mono uppercase text-ink/35">Итого разово</p>
              <p className="type-stat font-display mt-3 text-[clamp(1.5rem,2vw,2rem)]">
                {content.savings.totalOneOff}
              </p>
            </div>
            <div className="border-b border-ink/10 bg-cream px-6 py-7 sm:border-b-0 sm:border-r sm:border-ink/10 md:px-8 md:py-9">
              <p className="type-label font-mono uppercase text-ink/35">По абонементу</p>
              <p className="type-stat font-display mt-3 text-[clamp(1.5rem,2vw,2rem)]">
                {content.savings.totalPackage}
              </p>
            </div>
            <div className="bg-wine px-6 py-7 text-ivory md:px-8 md:py-9">
              <p className="type-label font-mono uppercase text-ivory/55">Ваша экономия</p>
              <p className="type-stat font-display mt-3 text-[clamp(1.5rem,2vw,2rem)] text-ivory">
                {content.savings.save}
              </p>
            </div>
          </div>
          <p className="type-body-sm mt-5 max-w-[54ch] text-ink/45">{content.savings.note}</p>
        </div>
      </section>

      {/* 9. Extras */}
      <section className="bg-cream py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Вне пакета</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[14ch]">
              {content.extras.title}
            </h2>
            <p className="type-body-sm mt-5 max-w-[48ch] text-ink/55">{content.extras.lead}</p>
          </Reveal>

          <RevealStagger className="mt-10 border-t border-ink md:mt-14">
            {content.extras.items.map((item) => (
              <div
                key={item}
                data-reveal-item
                className="flex gap-4 border-b border-ink/15 py-5 md:py-6"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-wine" aria-hidden />
                <p className="type-body-sm max-w-[60ch] text-ink/75">{item}</p>
              </div>
            ))}
          </RevealStagger>

          <Reveal>
            <div className="grid border-b border-ink lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <p className="type-body-sm max-w-[58ch] py-8 text-ink/55 lg:pr-12">
                {content.extras.warning}
              </p>
              <div className="border-t border-ink/15 py-8 lg:border-l lg:border-t-0 lg:pl-10">
                <MessengerButton>{content.extras.cta}</MessengerButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 10. Process */}
      <section className="bg-ink py-16 text-ivory sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow light>Процесс</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[12ch]">
              Как мы работаем
            </h2>
          </Reveal>

          <RevealStagger className="mt-12 border-t border-ivory/15 md:mt-16">
            {content.process.map((step, index) => (
              <article
                key={step.title}
                data-reveal-item
                className="grid gap-4 border-b border-ivory/15 py-7 md:grid-cols-[6rem_minmax(11rem,16rem)_minmax(0,1fr)] md:items-center md:gap-10 md:py-9"
              >
                <span className="type-stat text-stroke-ivory font-display">
                  {pad(index)}
                </span>
                <h3 className="type-card-title font-display font-medium">{step.title}</h3>
                <p className="type-body-sm max-w-[44ch] text-ivory/55">{step.text}</p>
              </article>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* 11. FAQ */}
      <section className="bg-cream py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-20 xl:gap-28">
          <Reveal>
            <div>
              <SectionEyebrow>Вопрос / ответ</SectionEyebrow>
              <h2 className="type-section-title font-display max-w-[10ch]">
                Часто задаваемые вопросы
              </h2>
              <MessengerButton className="mt-8">Получить консультацию</MessengerButton>
            </div>
          </Reveal>

          <div className="border-t border-ink">
            {content.faq.map((item, index) => {
              const open = openFaq === index;
              return (
                <article key={item.question} className="border-b border-ink/15">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    className="grid w-full grid-cols-[minmax(0,1fr)_1.25rem] items-start gap-x-5 py-6 text-left outline-none transition-colors hover:text-wine focus-visible:bg-ivory focus-visible:text-wine md:py-7"
                    aria-expanded={open}
                  >
                    <h3 className="type-service-title font-display font-medium leading-[1.2]">
                      {item.question}
                    </h3>
                    <span className="type-label pt-1 text-center text-ink/40" aria-hidden>
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  <AccordionPanel open={open} className="max-w-[52ch] pb-7">
                    <p className="type-body-sm text-ink/60">{item.answer}</p>
                  </AccordionPanel>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. Finale */}
      <section className="relative overflow-hidden bg-wine py-16 text-ivory sm:py-20 md:py-28">
        <ContactSky />
        <div className="container-x relative z-10 mx-auto max-w-[1440px]">
          <Reveal>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(14rem,0.75fr)] lg:items-end lg:gap-16">
              <div>
                <h2 className="type-section-title font-display max-w-[16ch]">
                  {content.finale.title}
                </h2>
                <p className="type-body mt-5 max-w-[40ch] text-ivory/70">
                  {content.finale.text}
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <MessengerButton className="border border-ivory/30 !bg-transparent !text-ivory hover:!bg-ivory/10">
                    {content.finale.secondaryCta}
                  </MessengerButton>
                </div>
              </div>
              <div className="border-t border-ivory/20 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <p className="type-label mb-4 font-mono uppercase text-ivory/45">
                  Читайте также
                </p>
                <TextLink href={content.finale.article.href} light>
                  {content.finale.article.label}
                </TextLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="border-t border-ink/10 bg-ivory">
        <div className="container-x mx-auto flex max-w-[1440px] items-center justify-between py-7">
          <span className="type-label truncate pr-4 font-mono uppercase text-ink/40">
            {SUBSCRIPTION_META.title}
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
