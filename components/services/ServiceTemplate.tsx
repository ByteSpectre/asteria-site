"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Arrow from "@/components/Arrow";
import LeadButton from "@/components/contact/LeadButton";
import MagneticButton from "@/components/MagneticButton";
import Reveal from "@/components/Reveal";
import RevealStagger from "@/components/RevealStagger";
import SectionConstellation from "@/components/SectionConstellation";
import Star from "@/components/Star";
import { gsap, useGSAP } from "@/lib/gsap";
import { lockPageScroll } from "@/lib/lock-page-scroll";
import type {
  ServiceCaseItem,
  ServicePriceItem,
  ServiceQaItem,
} from "@/lib/service-content";
import { SERVICE_TEMPLATE_DEFAULTS } from "@/lib/service-template-defaults";

export type ServiceTemplateProps = {
  title: string;
  category: string;
  summary: string;
  pricing?: ServicePriceItem[];
  scopeItems?: ServiceQaItem[];
  faqItems?: ServiceQaItem[];
  cases?: ServiceCaseItem[];
};

function pad(index: number) {
  return String(index + 1).padStart(2, "0");
}

function SectionEyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={`eyebrow mb-5 flex items-center gap-2 ${
        light ? "text-ivory/55" : "text-wine"
      }`}
    >
      <Star className="h-2.5 w-2.5" />
      {children}
    </p>
  );
}

function AccordionPanel({
  open,
  children,
  className = "",
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}

function AdvantagesSection({
  items,
}: {
  items: readonly { title: string; subtitle: string }[];
}) {
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
        ease: "power3.out",
        scrollTrigger: { trigger: rule.current, start: "top 90%" },
      },
    );
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink py-16 text-ivory sm:py-20 md:py-28 lg:py-32">
      <SectionConstellation tone="wine" opacity={0.04} />
      <div className="container-x relative z-10 mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionEyebrow light>Преимущества</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[14ch]">
              Снижаем риск процедурных ошибок
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="type-body-sm max-w-[36ch] text-ivory/55 md:text-right">
              Документы и рекомендации опираются на актуальные требования и практику по трудовым
              спорам.
            </p>
          </Reveal>
        </div>

        <div
          ref={rule}
          className="origin-left border-b border-ivory/15"
          style={{ transform: "scaleX(0)" }}
        />

        <div className="grid gap-px overflow-hidden border border-ivory/12 bg-ivory/12 sm:grid-cols-2">
          {items.map((item, index) => {
            const accent = index === items.length - 1;
            return (
              <Reveal key={item.title} delay={index * 0.07}>
                <article
                  className={`relative flex min-h-[200px] flex-col justify-between overflow-hidden p-6 sm:min-h-[220px] sm:p-7 md:min-h-[280px] md:p-10 ${
                    accent ? "bg-wine text-ivory" : "bg-ink text-ivory"
                  }`}
                >
                  <span
                    className={`type-label font-mono uppercase ${
                      accent ? "text-ivory/45" : "text-ivory/30"
                    }`}
                  >
                    {pad(index)}
                  </span>
                  <div className="pt-10">
                    <h3 className="type-stat font-display max-w-[10ch]">{item.title}</h3>
                    <p
                      className={`type-body-sm mt-4 max-w-[22ch] ${
                        accent ? "text-ivory/70" : "text-ivory/45"
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ items }: { items: ServicePriceItem[] }) {
  const [openMobile, setOpenMobile] = useState<number | null>(null);

  return (
    <section id="formats" className="scroll-mt-24 bg-wine py-16 text-ivory sm:py-20 md:py-28 lg:py-32">
      <div className="container-x mx-auto max-w-[1440px]">
        <Reveal>
          <SectionEyebrow light>Формат сотрудничества</SectionEyebrow>
          <h2 className="type-section-title font-display max-w-[18ch]">
            Выберите нужный объём
          </h2>
        </Reveal>

        <div className="mt-12 hidden lg:mt-16 lg:block">
          <div className="grid grid-cols-[4rem_minmax(0,1fr)_10rem_auto] items-center gap-x-8 border-b border-ivory/20 px-5 pb-4 xl:gap-x-10">
            <span className="type-label font-mono uppercase text-ivory/40" />
            <span className="type-label font-mono uppercase text-ivory/40">Услуга</span>
            <span className="type-label font-mono uppercase text-ivory/40">Стоимость</span>
            <span className="sr-only">Действие</span>
          </div>
          <RevealStagger>
            {items.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                data-reveal-item
                className="group grid grid-cols-[4rem_minmax(0,1fr)_10rem_auto] items-center gap-x-8 border-b border-ivory/15 px-5 py-7 xl:gap-x-10"
              >
                <span className="type-label font-mono text-ivory/40">{pad(index)}</span>
                <h3 className="type-service-title font-display font-medium">{item.title}</h3>
                <p className="type-body-sm text-ivory/80">{item.price}</p>
                <div className="flex justify-end">
                  <LeadButton
                    serviceName={item.title}
                    className="type-label inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-ivory/25 font-mono uppercase text-ivory transition-[width,padding,background-color,border-color,color,gap] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-[13.5rem] group-hover:gap-2 group-hover:border-ivory group-hover:bg-ivory group-hover:px-5 group-hover:text-wine"
                  >
                    <span className="hidden whitespace-nowrap group-hover:inline">
                      Заказать услугу
                    </span>
                  </LeadButton>
                </div>
              </article>
            ))}
          </RevealStagger>
        </div>

        <div className="mt-10 border-t border-ivory/20 lg:hidden">
          {items.map((item, index) => {
            const open = openMobile === index;
            return (
              <article key={`${item.title}-${index}`} className="border-b border-ivory/15">
                <button
                  type="button"
                  onClick={() => setOpenMobile(open ? null : index)}
                  className="flex w-full items-start gap-3 py-5 text-left sm:gap-4 sm:py-6"
                  aria-expanded={open}
                >
                  <span className="type-label w-8 shrink-0 font-mono text-ivory/40">
                    {pad(index)}
                  </span>
                  <span className="type-service-title min-w-0 flex-1 font-display font-medium">
                    {item.title}
                  </span>
                  <span className="type-label text-ivory/50">{open ? "−" : "+"}</span>
                </button>
                <AccordionPanel open={open} className="pb-6 pl-11 sm:pl-12">
                  <p className="type-body-sm text-ivory/75">{item.price}</p>
                  <LeadButton
                    serviceName={item.title}
                    className="type-label mt-5 h-12 bg-ivory px-6 font-mono uppercase text-wine"
                  >
                    Заказать услугу
                  </LeadButton>
                </AccordionPanel>
              </article>
            );
          })}
        </div>

        <Reveal delay={0.08}>
          <p className="type-body-sm mt-8 max-w-[48ch] text-ivory/55">
            Финальная стоимость зависит от объёма документов и сложности задачи и фиксируется в
            договоре.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PrinciplesSection({
  items,
}: {
  items: readonly { title: string; text: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-cream py-16 sm:py-20 md:py-28 lg:py-32">
      <div className="container-x mx-auto max-w-[1440px]">
        <div className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionEyebrow>Принципы</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[14ch]">
              Понятные правила работы
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="type-body-sm max-w-[30ch] text-ink/55 md:text-right">
              Четыре условия, которые фиксируем до начала любого проекта.
            </p>
          </Reveal>
        </div>

        <div className="relative md:hidden">
          <div aria-hidden className="absolute top-2 bottom-2 left-5 w-px bg-wine/20" />
          <div className="space-y-8">
            {items.map((item, index) => {
              const last = index === items.length - 1;
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

        <div className="relative hidden md:block">
          <div aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-wine/20" />
          <div aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-wine/20" />

          <div className="grid grid-cols-2">
            {items.map((item, index) => (
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
  );
}

export function ServiceTemplate({
  title,
  category,
  summary,
  pricing,
  scopeItems,
  faqItems,
  cases,
}: ServiceTemplateProps) {
  const staticData = SERVICE_TEMPLATE_DEFAULTS;
  const resolvedPricing =
    pricing && pricing.length > 0 ? pricing : [...staticData.pricing];
  const resolvedScope =
    scopeItems && scopeItems.length > 0
      ? scopeItems
      : staticData.scope.map((item) => ({ question: item.title, answer: item.text }));
  const resolvedFaq = faqItems && faqItems.length > 0 ? faqItems : [...staticData.faq];
  const resolvedCases = cases && cases.length > 0 ? cases : [];

  const [openScope, setOpenScope] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-cream text-ink">
      <section className="border-t border-ink bg-cream">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <nav className="flex flex-wrap items-center gap-3 pt-6 pb-8">
              <Link href="/" className="eyebrow link-underline text-ink/40 hover:text-wine">
                Услуги
              </Link>
              <span className="eyebrow text-ink/25">/</span>
              <span className="eyebrow text-ink/40">{category}</span>
            </nav>
          </Reveal>

          <div className="grid border-y border-ink lg:grid-cols-[1fr_minmax(16rem,20rem)]">
            <Reveal className="relative flex min-h-[280px] flex-col justify-end py-8 pr-0 sm:min-h-[360px] sm:py-10 lg:min-h-[560px] lg:pr-[72px] lg:pb-14 lg:pt-10 xl:min-h-[608px]">
              <h1 className="type-hero-title font-display max-w-[16ch] text-ink">{title}</h1>
            </Reveal>

            <Reveal
              delay={0.1}
              className="flex flex-col justify-end border-t border-ink px-0 py-8 sm:py-10 lg:border-t-0 lg:border-l lg:px-11 lg:py-14"
            >
              <p className="eyebrow text-ink/40">Коротко об услуге</p>
              <p className="type-body mt-auto pt-10 text-ink/80 sm:pt-16">
                {summary || staticData.fallbackSummary}
              </p>
              <MagneticButton
                href="#formats"
                className="type-label mt-6 h-12 w-full justify-between bg-wine px-5 font-mono uppercase text-ivory sm:mt-8"
              >
                Выбрать формат
                <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
            </Reveal>
          </div>
        </div>
      </section>

      <PrinciplesSection items={staticData.principles} />

      <PricingSection items={resolvedPricing} />

      <AdvantagesSection items={staticData.advantages} />

      <section id="practice" className="scroll-mt-24 bg-cream py-16 sm:py-20 md:py-28 lg:py-32">
        <div className="container-x mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] xl:gap-28">
          <Reveal>
            <SectionEyebrow>Практика</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[12ch]">
              Что можем взять на себя
            </h2>
            <p className="type-body-sm mt-5 max-w-[34ch] text-ink/55 sm:mt-6">
              Откройте направление, чтобы посмотреть состав работ.
            </p>
          </Reveal>
          <RevealStagger className="border-t border-ink/15">
            {resolvedScope.map((item, index) => {
              const open = openScope === index;
              return (
                <article
                  key={`${item.question}-${index}`}
                  data-reveal-item
                  className="border-b border-ink/15"
                >
                  <button
                    type="button"
                    onClick={() => setOpenScope(open ? null : index)}
                    className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)_1.5rem] items-start gap-x-3 py-5 text-left sm:grid-cols-[2.75rem_minmax(0,1fr)_1.5rem] sm:gap-x-4 sm:py-6 md:grid-cols-[4rem_minmax(0,1fr)_1.5rem] md:gap-x-8 md:py-7"
                    aria-expanded={open}
                  >
                    <span className="type-label font-mono text-ink/35">{pad(index)}</span>
                    <h3 className="type-service-title font-display font-medium">{item.question}</h3>
                    <span className="type-label text-center text-ink/45">{open ? "−" : "+"}</span>
                  </button>
                  <AccordionPanel open={open} className="max-w-[52ch] pb-6 pl-[calc(2.5rem+0.75rem)] sm:pb-7 sm:pl-[calc(2.75rem+1rem)] md:pl-[calc(4rem+2rem)]">
                    <p className="type-body-sm text-ink/60">{item.answer}</p>
                  </AccordionPanel>
                </article>
              );
            })}
          </RevealStagger>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-wine py-16 text-ivory sm:py-20 md:py-28 lg:py-32">
        <div className="container-x mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] xl:gap-28">
          <Reveal>
            <div className="flex h-full flex-col">
              <SectionEyebrow light>Вопрос / ответ</SectionEyebrow>
              <h2 className="type-section-title font-display max-w-[10ch]">До начала работы</h2>
              <LeadButton
                className="type-label mt-8 font-mono uppercase text-ivory/80 hover:text-ivory lg:mt-auto lg:pt-16"
              >
                Задать свой вопрос
              </LeadButton>
            </div>
          </Reveal>
          <RevealStagger className="border-t border-ivory/20">
            {resolvedFaq.map((item, index) => {
              const open = openFaq === index;
              return (
                <article
                  key={`${item.question}-${index}`}
                  data-reveal-item
                  className="border-b border-ivory/15"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="grid w-full grid-cols-[minmax(0,1fr)_1.5rem] items-start gap-x-4 py-6 text-left md:py-7"
                    aria-expanded={open}
                  >
                    <h3 className="type-service-title font-display font-medium text-ivory">
                      {item.question}
                    </h3>
                    <span className="type-label text-center text-ivory/55">{open ? "−" : "+"}</span>
                  </button>
                  <AccordionPanel open={open} className="max-w-[54ch] pb-7">
                    <p className="type-body-sm text-ivory/70">{item.answer}</p>
                  </AccordionPanel>
                </article>
              );
            })}
          </RevealStagger>
        </div>
      </section>

      <CasesSection cases={resolvedCases} />

      <div className="border-t border-ink/10 bg-ivory">
        <div className="container-x mx-auto flex max-w-[1440px] items-center justify-between py-7">
          <span className="type-label truncate pr-4 font-mono uppercase text-ink/40">{title}</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="type-label shrink-0 cursor-pointer font-mono uppercase text-ink/45 hover:text-wine"
          >
            Наверх ↑
          </button>
        </div>
      </div>
    </div>
  );
}

function CasesSection({ cases }: { cases: ServiceCaseItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [pullingIndex, setPullingIndex] = useState<number | null>(null);
  const paperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (openIndex === null) {
      document.body.classList.remove("case-popup-open");
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCase();
    };
    const unlock = lockPageScroll();
    document.body.classList.add("case-popup-open");
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      document.body.classList.remove("case-popup-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex]);

  useGSAP(
    () => {
      if (openIndex === null) return;
      const modal = modalRef.current;
      if (!modal) return;

      if (reducedMotion.current) {
        gsap.set(modal, { clearProps: "all", autoAlpha: 1 });
        return;
      }

      gsap.fromTo(
        modal,
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" },
      );
    },
    { dependencies: [openIndex] },
  );

  const openCase = (index: number) => {
    if (pullingIndex !== null || openIndex !== null) return;
    const paper = paperRefs.current[index];

    if (!paper || reducedMotion.current) {
      setOpenIndex(index);
      return;
    }

    setPullingIndex(index);
    gsap.to(paper, {
      y: -64,
      scale: 1.03,
      duration: 0.45,
      ease: "power2.out",
      onComplete: () => {
        setOpenIndex(index);
        setPullingIndex(null);
        gsap.set(paper, { y: 0, scale: 1 });
      },
    });
  };

  const closeCase = () => {
    const modal = modalRef.current;

    if (!modal || reducedMotion.current) {
      setOpenIndex(null);
      return;
    }

    gsap.to(modal, {
      autoAlpha: 0,
      y: 20,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => setOpenIndex(null),
    });
  };

  const activeCase = openIndex !== null ? cases[openIndex] : null;

  return (
    <section className="relative overflow-hidden bg-cream py-16 sm:py-20 md:py-28 lg:py-32">
      <SectionConstellation tone="wine" opacity={0.025} />
      <div className="container-x relative z-10 mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionEyebrow>Дела</SectionEyebrow>
            <h2 className="type-section-title font-display max-w-[16ch]">
              Задача – результат
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="type-body-sm max-w-[32ch] text-ink/55 md:text-right">
              Откройте папку — лист выедет и покажет карточку дела.
            </p>
          </Reveal>
        </div>

        {cases.length ? (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3">
            {cases.map((item, index) => (
              <li key={`${item.title}-${index}`}>
                <Reveal delay={(index % 3) * 0.08}>
                  <button
                    type="button"
                    onClick={() => openCase(index)}
                    className="group relative block w-full cursor-pointer text-left outline-none"
                    aria-label={`Открыть дело: ${item.title || `Дело ${pad(index)}`}`}
                  >
                    <div className="relative aspect-[5/4] w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
                      <div className="absolute top-3 left-[14%] z-10 h-7 w-[38%] bg-[#6b1f2a]" />
                      <div className="absolute inset-x-0 top-8 bottom-0 bg-[#5c1a24] shadow-[0_18px_40px_rgba(40,16,18,0.18)]" />
                      <div
                        ref={(node) => {
                          paperRefs.current[index] = node;
                        }}
                        className="absolute inset-x-[10%] top-[18%] bottom-[12%] z-20 origin-bottom bg-[#f7f1e8] shadow-[0_6px_18px_rgba(40,16,18,0.1)]"
                      >
                        <div className="flex h-full flex-col px-4 pt-4 pb-4 sm:px-5">
                          <span className="type-label font-mono uppercase text-ink/30">
                            Дело {pad(index)}
                          </span>
                          <p className="type-card-title font-display mt-3 line-clamp-3 font-medium text-ink">
                            {item.title || "Без названия"}
                          </p>
                          <div className="mt-auto space-y-2 pt-4">
                            <span className="block h-px w-full bg-ink/10" />
                            <span className="block h-px w-[78%] bg-ink/8" />
                            <span className="block h-px w-[62%] bg-ink/8" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-x-0 top-[30%] bottom-0 z-30 overflow-hidden bg-wine shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
                        <div className="absolute inset-x-5 bottom-5">
                          <p className="type-label font-mono uppercase text-ivory/45">
                            {item.court || "Суд не указан"}
                          </p>
                          <p className="type-body-sm mt-2 line-clamp-2 text-ivory/85">
                            {item.result || item.role || "Открыть карточку"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <Reveal>
            <div className="border border-dashed border-ink/15 px-8 py-20 text-center">
              <p className="type-label font-mono uppercase text-ink/35">Пока пусто</p>
              <p className="type-body-sm mx-auto mt-4 max-w-[36ch] text-ink/45">
                Добавьте дела в админке услуги — они появятся сеткой по три в ряд.
              </p>
            </div>
          </Reveal>
        )}
      </div>

      {activeCase && openIndex !== null ? (
        <div className="fixed inset-0 z-[110]">
          <div ref={modalRef} className="h-full w-full" style={{ opacity: 0 }}>
            <div
              role="dialog"
              aria-modal="true"
              aria-label={activeCase.title || `Дело ${pad(openIndex)}`}
              data-lenis-prevent
              className="case-popup-scroll h-dvh w-full overflow-y-auto overscroll-contain bg-[#f7f1e8]"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between bg-[#f7f1e8]/95 px-5 py-4 backdrop-blur-sm sm:px-10">
                <p className="type-label font-mono uppercase text-ink/35">Дело {pad(openIndex)}</p>
                <button
                  type="button"
                  onClick={closeCase}
                  className="type-label h-10 cursor-pointer px-3 font-mono uppercase text-ink/50 transition-colors hover:text-wine"
                >
                  Закрыть ✕
                </button>
              </div>

              <div className="container-x mx-auto max-w-[1440px] px-5 py-8 pb-16 sm:px-10 sm:py-14 lg:px-16">
                <article className="mx-auto w-full max-w-[720px]">
                  <h2 className="type-section-title font-display text-ink">
                    {activeCase.title || "Без названия"}
                  </h2>

                  <CaseArticleBlock heading="Суд" body={activeCase.court} />
                  <CaseArticleBlock heading="Роль" body={activeCase.role} />
                  <CaseArticleBlock heading="Сложность" body={activeCase.complexity} />
                  <CaseArticleBlock heading="Что сделали" body={activeCase.whatDone} />
                  <CaseArticleBlock heading="Результат" body={activeCase.result} />
                </article>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function CaseArticleBlock({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="mt-10">
      <h3 className="type-card-title font-display font-medium text-ink">{heading}</h3>
      <p className="type-body-sm mt-3 text-ink/65">{body || "—"}</p>
    </section>
  );
}
