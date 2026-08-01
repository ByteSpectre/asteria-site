"use client";

import Link from "next/link";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import RevealStagger from "@/components/RevealStagger";
import SectionConstellation from "@/components/SectionConstellation";
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
  pad,
} from "@/components/services/ui";

const content = SUBSCRIPTION_CONTENT;

export default function SubscriptionServicePage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <ServicePageShell>
      <section className="border-t border-ink">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <ServiceBreadcrumb
              category={SUBSCRIPTION_META.category}
              title={SUBSCRIPTION_META.title}
            />
          </Reveal>

          <div className="grid gap-8 border-y border-ink py-9 sm:py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] lg:gap-16 lg:py-14">
            <Reveal>
              <SectionEyebrow>{content.hero.eyebrow}</SectionEyebrow>
              <h1 className="service-hero-title max-w-[16ch] text-ink lg:max-w-[14ch]">
                {content.hero.title}
              </h1>
              <p className="type-body mt-6 max-w-[42ch] text-ink/70">{content.hero.text}</p>
            </Reveal>

            <Reveal
              delay={0.08}
              className="flex min-w-0 flex-col justify-end border-t border-ink/15 pt-7 lg:justify-center lg:border-t-0 lg:border-l lg:border-ink lg:pt-0 lg:pl-10"
            >
              <p className="type-label font-mono uppercase text-wine">Бонус</p>
              <p className="type-card-title font-display mt-3 font-medium text-ink">
                {content.hero.bonus}
              </p>
              <MessengerButton className="mt-8">
                {content.hero.cta}
              </MessengerButton>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Сравнение</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[16ch]">
              {content.comparison.title}
            </h2>
          </Reveal>

          <div className="mt-10 hidden grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-px overflow-hidden border border-ink/12 bg-ink/12 md:mt-14 md:grid">
            <div className="bg-cream px-6 py-4">
              <p className="type-label font-mono uppercase text-ink/40">
                {content.comparison.leftLabel}
              </p>
            </div>
            <div className="bg-wine px-6 py-4">
              <p className="type-label font-mono uppercase text-ivory/70">
                {content.comparison.rightLabel}
              </p>
            </div>
            {content.comparison.rows.map((row) => (
              <div key={row.left} className="contents">
                <div className="bg-cream px-6 py-6">
                  <p className="type-body-sm text-ink/50">{row.left}</p>
                </div>
                <div className="bg-wine px-6 py-6">
                  <p className="type-body-sm text-ivory/85">{row.right}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4 md:hidden">
            {content.comparison.rows.map((row, index) => (
              <article key={row.left} className="border border-ink/12">
                <div className="bg-cream px-5 py-4">
                  <p className="type-label mb-2 font-mono uppercase text-ink/35">
                    {pad(index)} · {content.comparison.leftLabel}
                  </p>
                  <p className="type-body-sm text-ink/55">{row.left}</p>
                </div>
                <div className="bg-wine px-5 py-4 text-ivory">
                  <p className="type-label mb-2 font-mono uppercase text-ivory/45">
                    {content.comparison.rightLabel}
                  </p>
                  <p className="type-body-sm text-ivory/85">{row.right}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Преимущества</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[12ch]">
              Что даёт абонемент
            </h2>
          </Reveal>

          <ol className="mt-12 border-t border-ink/15 md:mt-16">
            <RevealStagger>
              {content.advantages.map((item, index) => (
                <li
                  key={item.title}
                  data-reveal-item
                  className="grid gap-3 border-b border-ink/15 py-7 md:grid-cols-[5rem_minmax(10rem,16rem)_minmax(0,1fr)] md:gap-10 md:py-8"
                >
                  <span className="type-stat font-display text-wine/80">{pad(index)}</span>
                  <h3 className="type-card-title font-display font-medium md:pt-2">{item.title}</h3>
                  <p className="type-body-sm max-w-[48ch] text-ink/60 md:pt-2">{item.text}</p>
                </li>
              ))}
            </RevealStagger>
          </ol>
        </div>
      </section>

      <section className="bg-ivory py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Кому подойдёт</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[14ch]">
              Под ваш масштаб задач
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden border border-ink/12 bg-ink/12 sm:grid-cols-2">
            {content.audience.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <article className="flex h-full min-h-[160px] flex-col justify-between bg-ivory p-5 sm:min-h-[180px] sm:p-6 md:min-h-[210px] md:p-8">
                  <span className="type-label font-mono text-ink/30">{pad(index)}</span>
                  <div className="pt-8">
                    <h3 className="type-card-title font-display font-medium">{item.title}</h3>
                    <p className="type-body-sm mt-3 max-w-[28ch] text-ink/55">{item.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Наполнение</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[14ch]">
              {content.inclusions.title}
            </h2>
            <p className="type-body-sm mt-5 max-w-[46ch] text-ink/55">{content.inclusions.lead}</p>
          </Reveal>

          <div className="mt-10 border-t border-ink/15 md:mt-14">
            <div className="hidden grid-cols-[4rem_minmax(0,1fr)_8rem] items-center gap-8 border-b border-ink/15 py-4 md:grid">
              <span aria-hidden />
              <span className="type-label font-mono uppercase text-ink/35">Услуга</span>
              <span className="type-label font-mono uppercase text-ink/35">Время</span>
            </div>
            {content.inclusions.rows.map((row, index) => (
              <div
                key={row.service}
                className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-ink/15 py-5 md:grid-cols-[4rem_minmax(0,1fr)_8rem] md:items-center md:gap-8 md:py-6"
              >
                <span className="type-label font-mono text-ink/30">{pad(index)}</span>
                <p className="type-body-sm text-ink/80">{row.service}</p>
                <p className="type-body-sm col-start-2 text-ink/55 md:col-start-3 md:text-ink/70">
                  {row.time}
                </p>
              </div>
            ))}
          </div>
          <p className="type-body-sm mt-5 text-ink/45">{content.inclusions.note}</p>
        </div>
      </section>

      <section id="packages" className="scroll-mt-24 bg-wine py-16 text-ivory sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow light>Пакеты</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[14ch]">
              Выберите объём часов
            </h2>
            <p className="type-body-sm mt-5 max-w-[42ch] text-ivory/55">
              Ставка 5 000 ₽/час. Вы сами решаете, как распределить часы — комбинации ниже лишь ориентир.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3">
            {content.packages.map((pack, index) => (
              <Reveal key={pack.id} delay={index * 0.06}>
                <article
                  className={`flex h-full flex-col border p-6 md:p-8 ${
                    pack.featured
                      ? "border-ivory bg-ivory text-ink"
                      : "border-ivory/20 bg-transparent text-ivory"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`type-label font-mono uppercase ${
                        pack.featured ? "text-wine" : "text-ivory/45"
                      }`}
                    >
                      {pack.featured ? "Популярный" : pad(index)}
                    </span>
                    <span
                      className={`type-label font-mono ${
                        pack.featured ? "text-ink/40" : "text-ivory/40"
                      }`}
                    >
                      {pack.hours}
                    </span>
                  </div>
                  <h3 className="type-stat font-display mt-8">{pack.name}</h3>
                  <p className="type-section-title font-display mt-4 text-[clamp(2rem,3vw,2.75rem)]">
                    {pack.price}
                    <span
                      className={`type-label ml-2 font-mono uppercase ${
                        pack.featured ? "text-ink/40" : "text-ivory/40"
                      }`}
                    >
                      / мес
                    </span>
                  </p>
                  <p
                    className={`type-body-sm mt-4 ${
                      pack.featured ? "text-ink/55" : "text-ivory/55"
                    }`}
                  >
                    {pack.forWhom}
                  </p>
                  <p
                    className={`type-body-sm mt-6 border-t pt-5 ${
                      pack.featured
                        ? "border-ink/10 text-ink/60"
                        : "border-ivory/15 text-ivory/60"
                    }`}
                  >
                    {pack.examples}
                  </p>
                  <MessengerButton
                    className={`mt-8 !w-full ${
                      pack.featured
                        ? "bg-wine text-ivory"
                        : "bg-ivory text-wine"
                    }`}
                  >
                    Выбрать пакет
                  </MessengerButton>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Долгосрочно</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[16ch]">
              {content.longTerm.title}
            </h2>
            <p className="type-body-sm mt-5 max-w-[46ch] text-ink/55">{content.longTerm.lead}</p>
            <p className="type-label mt-4 font-mono uppercase text-wine">
              {content.longTerm.exampleLabel}
            </p>
          </Reveal>

          <div className="mt-10 border-t border-ink/15 md:mt-14">
            {content.longTerm.rows.map((row, index) => (
              <div
                key={row.term}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-ink/15 py-5 sm:grid-cols-[2.75rem_minmax(0,1fr)_auto] sm:items-start sm:gap-4 md:grid-cols-[4rem_8rem_minmax(0,1fr)_9rem] md:items-center md:gap-8 md:py-6"
              >
                <span className="type-label font-mono text-ink/35">{pad(index)}</span>
                <p className="type-card-title font-display font-medium">{row.term}</p>
                <p className="type-body-sm col-start-2 text-ink/55 sm:col-start-2 md:col-start-3">
                  {row.bonus}
                </p>
                <p className="type-body-sm col-start-2 font-medium text-ink sm:col-start-3 sm:row-span-2 sm:self-center sm:text-right md:col-start-4 md:row-span-1">
                  {row.price}
                </p>
              </div>
            ))}
          </div>
          <p className="type-body-sm mt-6 max-w-[52ch] text-ink/55">{content.longTerm.highlight}</p>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Экономия</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[16ch]">
              {content.savings.title}
            </h2>
            <p className="type-body-sm mt-5 text-ink/55">{content.savings.lead}</p>
          </Reveal>

          <div className="mt-10 hidden overflow-x-auto border-t border-ink/15 md:mt-14 md:block">
            <table className="w-full min-w-[36rem] text-left">
              <thead>
                <tr className="border-b border-ink/15">
                  <th className="type-label py-4 pr-4 font-mono font-normal uppercase text-ink/35">
                    Услуга
                  </th>
                  <th className="type-label py-4 pr-4 font-mono font-normal uppercase text-ink/35">
                    Разово
                  </th>
                  <th className="type-label py-4 font-mono font-normal uppercase text-ink/35">
                    В пакете
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.savings.rows.map((row) => (
                  <tr key={row.service} className="border-b border-ink/10">
                    <td className="type-body-sm py-5 pr-4 text-ink/80">{row.service}</td>
                    <td className="type-body-sm py-5 pr-4 text-ink/55">{row.oneOff}</td>
                    <td className="type-body-sm py-5 text-ink/80">{row.inPackage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 space-y-3 md:hidden">
            {content.savings.rows.map((row, index) => (
              <article key={row.service} className="border border-ink/12 bg-ivory p-5">
                <div className="flex items-start gap-3">
                  <span className="type-label mt-1 shrink-0 font-mono text-ink/30">{pad(index)}</span>
                  <h3 className="type-card-title font-display font-medium">{row.service}</h3>
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-px bg-ink/10">
                  <div className="bg-cream p-3">
                    <dt className="type-label font-mono uppercase text-ink/35">Разово</dt>
                    <dd className="type-body-sm mt-1 text-ink/70">{row.oneOff}</dd>
                  </div>
                  <div className="bg-cream p-3">
                    <dt className="type-label font-mono uppercase text-wine">В пакете</dt>
                    <dd className="type-body-sm mt-1 text-ink/80">{row.inPackage}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-4 border border-ink/12 bg-ivory p-6 sm:grid-cols-3 md:p-8">
            <div>
              <p className="type-label font-mono uppercase text-ink/35">Разово за 8 ч</p>
              <p className="type-card-title font-display mt-2 font-medium">{content.savings.totalOneOff}</p>
            </div>
            <div>
              <p className="type-label font-mono uppercase text-ink/35">По абонементу</p>
              <p className="type-card-title font-display mt-2 font-medium">{content.savings.totalPackage}</p>
            </div>
            <div>
              <p className="type-label font-mono uppercase text-wine">Ваша экономия</p>
              <p className="type-card-title font-display mt-2 font-medium text-wine">
                {content.savings.save}
              </p>
            </div>
          </div>
          <p className="type-body-sm mt-5 max-w-[54ch] text-ink/45">{content.savings.note}</p>
        </div>
      </section>

      <section className="bg-ivory py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow>Вне пакета</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[14ch]">
              {content.extras.title}
            </h2>
            <p className="type-body-sm mt-5 max-w-[46ch] text-ink/55">{content.extras.lead}</p>
          </Reveal>

          <ul className="mt-10 border-t border-ink/15 md:mt-14">
            {content.extras.items.map((item, index) => (
              <li
                key={item}
                className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 border-b border-ink/15 py-5 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-8 md:py-6"
              >
                <span className="type-label font-mono text-ink/30">{pad(index)}</span>
                <p className="type-body-sm text-ink/75">{item}</p>
              </li>
            ))}
          </ul>

          <p className="type-body-sm mt-6 max-w-[60ch] text-ink/45">{content.extras.warning}</p>
          <div className="mt-6">
            <MessengerButton>Узнать стоимость</MessengerButton>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink py-16 text-ivory sm:py-20 md:py-28">
        <SectionConstellation tone="wine" opacity={0.04} />
        <div className="container-x relative z-10 mx-auto max-w-[1440px]">
          <Reveal>
            <SectionEyebrow light>Как мы работаем</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[12ch]">Пять шагов</h2>
          </Reveal>

          <ol className="mt-12 border-t border-ivory/15 md:mt-16">
            {content.process.map((step, index) => (
              <li
                key={step.title}
                className="grid gap-3 border-b border-ivory/15 py-6 md:grid-cols-[5rem_minmax(10rem,16rem)_minmax(0,1fr)] md:gap-10 md:py-7"
              >
                <span className="type-label font-mono text-ivory/35">{pad(index)}</span>
                <h3 className="type-card-title font-display font-medium">{step.title}</h3>
                <p className="type-body-sm text-ivory/60">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20 md:py-28">
        <div className="container-x mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          <Reveal>
            <SectionEyebrow>Вопрос / ответ</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[10ch]">До подключения</h2>
            <MessengerButton className="mt-8">Получить консультацию</MessengerButton>
          </Reveal>

          <div className="border-t border-ink/15">
            {content.faq.map((item, index) => {
              const open = openFaq === index;
              return (
                <article key={item.question} className="border-b border-ink/15">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    className="grid w-full grid-cols-[minmax(0,1fr)_1.5rem] items-start gap-x-4 py-6 text-left outline-none transition-colors hover:text-wine focus-visible:bg-ivory focus-visible:text-wine md:py-7"
                    aria-expanded={open}
                  >
                    <h3 className="type-service-title font-display font-medium">{item.question}</h3>
                    <span className="type-label text-center text-ink/45">{open ? "−" : "+"}</span>
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

      <section className="relative overflow-hidden bg-wine py-16 text-ivory sm:py-20 md:py-24">
        <ContactSky />
        <div className="container-x relative z-10 mx-auto max-w-[1440px]">
          <Reveal>
            <h2 className="type-section-title font-display max-w-[16ch]">
              {content.finale.title}
            </h2>
            <p className="type-body mt-5 max-w-[36ch] text-ivory/70">{content.finale.text}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <MessengerButton className="bg-ivory text-wine">Выбрать пакет</MessengerButton>
              <MessengerButton className="border border-ivory/30 bg-transparent text-ivory">
                Получить консультацию
              </MessengerButton>
            </div>
            <Link
              href={content.finale.article.href}
              className="type-label mt-8 inline-flex font-mono uppercase text-ivory/55 transition-colors hover:text-ivory"
            >
              {content.finale.article.label} →
            </Link>
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
