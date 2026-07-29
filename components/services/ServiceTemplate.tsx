"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Reveal from "@/components/Reveal";
import RevealStagger from "@/components/RevealStagger";
import SectionConstellation from "@/components/SectionConstellation";
import { gsap, useGSAP } from "@/lib/gsap";
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
    <section className="relative overflow-hidden bg-ink py-16 text-ivory md:py-[150px]">
      <SectionConstellation tone="wine" opacity={0.04} />
      <div className="container-x relative z-10 mx-auto max-w-[1440px]">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)] lg:items-end lg:gap-16">
            <div>
              <p className="text-[12px] uppercase tracking-[0.08em] text-ivory/40">Преимущества</p>
              <h2 className="type-section-title mt-5 max-w-[14ch]">Снижаем риск процедурных ошибок</h2>
            </div>
            <p className="max-w-[36ch] text-[15px] leading-relaxed text-ivory/50 lg:justify-self-end lg:text-right">
              Документы и рекомендации опираются на актуальные требования и практику по трудовым спорам.
            </p>
          </div>
        </Reveal>

        <div
          ref={rule}
          className="mt-12 origin-left border-b border-ivory/15 md:mt-16"
          style={{ transform: "scaleX(0)" }}
        />

        <div className="mt-0 grid gap-px overflow-hidden border border-ivory/12 bg-ivory/12 sm:grid-cols-2">
          {items.map((item, index) => {
            const accent = index === items.length - 1;
            return (
              <Reveal key={item.title} delay={index * 0.07}>
                <article
                  className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden p-7 transition-colors duration-500 md:min-h-[300px] md:p-10 ${
                    accent ? "bg-wine text-ivory" : "bg-ink text-ivory hover:bg-[#1a1412]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`font-mono text-[11px] uppercase tracking-[0.12em] ${
                        accent ? "text-ivory/45" : "text-ivory/30"
                      }`}
                    >
                      {pad(index)}
                    </span>
                    <span
                      aria-hidden
                      className={`mt-1 h-1.5 w-1.5 rounded-full transition-transform duration-500 group-hover:scale-150 ${
                        accent ? "bg-ivory/70" : "bg-wine"
                      }`}
                    />
                  </div>

                  <div className="pt-10">
                    <h2 className="type-stat max-w-[10ch]">{item.title}</h2>
                    <p
                      className={`mt-4 max-w-[22ch] text-[14px] leading-snug tracking-[-0.01em] ${
                        accent ? "text-ivory/70" : "text-ivory/45"
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  </div>

                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 ${
                      accent ? "bg-ivory/35" : "bg-wine"
                    }`}
                  />
                </article>
              </Reveal>
            );
          })}
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

  const [openScope, setOpenScope] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-ivory text-ink">
      <section className="border-t border-ink">
        <div className="container-x mx-auto max-w-[1440px]">
          <Reveal>
            <div className="flex flex-wrap gap-3 pt-6 pb-8 text-[12px] uppercase tracking-[0.07em] text-ink/40">
              <Link href="/services" className="hover:text-wine">
                Услуги
              </Link>
              <span>/</span>
              <span>{category}</span>
            </div>
          </Reveal>

          <div className="grid border-y border-ink lg:grid-cols-[1fr_312px]">
            <Reveal className="relative flex min-h-[420px] flex-col justify-end py-10 pr-0 lg:min-h-[608px] lg:pr-[72px] lg:pb-14 lg:pt-10">
              <p className="absolute top-8 left-0 text-[13px] tracking-[0.08em] text-wine">
                01 — {pad(Math.max(resolvedScope.length - 1, 0))}
              </p>
              <h1 className="max-w-[16ch] text-ink">{title}</h1>
            </Reveal>

            <Reveal
              delay={0.1}
              className="flex flex-col justify-end border-t border-ink px-0 py-10 lg:border-t-0 lg:border-l lg:px-11 lg:py-14"
            >
              <p className="text-[12px] uppercase tracking-[0.08em] text-ink/40">Коротко об услуге</p>
              <p className="mt-auto pt-16 text-[18px] leading-[1.5] text-ink">
                {summary || staticData.fallbackSummary}
              </p>
              <a
                href="#formats"
                className="mt-8 inline-flex h-[58px] min-h-[58px] w-full items-center justify-between bg-wine px-5 text-[12px] font-normal uppercase tracking-[0.07em] text-cream"
              >
                Выбрать формат
                <span aria-hidden>↗</span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-[150px]">
        <div className="container-x mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[381px_1fr] lg:gap-[120px]">
          <Reveal>
            <p className="text-[12px] uppercase tracking-[0.08em] text-ink/40">Принципы</p>
            <h2 className="type-section-title mt-5 max-w-[12ch]">Понятные правила работы</h2>
          </Reveal>
          <RevealStagger className="border-t border-ink/15">
            {staticData.principles.map((item, index) => (
              <article
                key={item.title}
                data-reveal-item
                className="grid gap-4 border-b border-ink/15 py-8 md:grid-cols-[72px_minmax(0,1fr)_minmax(0,1.1fr)] md:items-start md:gap-7 md:py-10"
              >
                <span className="pt-2 text-[12px] uppercase tracking-[0.08em] text-ink/35">
                  {pad(index)}
                </span>
                <h2 className="font-normal tracking-[-0.03em]" style={{ fontSize: "24px", lineHeight: 1.25 }}>
                  {item.title}
                </h2>
                <p className="text-[15px] leading-relaxed text-ink/55 md:pt-1">{item.text}</p>
              </article>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section id="formats" className="scroll-mt-24 bg-wine py-16 text-ivory md:py-[150px]">
        <div className="container-x mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[395px_1fr] lg:gap-[110px]">
          <Reveal>
            <p className="text-[12px] uppercase tracking-[0.08em] text-ivory/45">Формат сотрудничества</p>
            <h2 className="type-section-title mt-5 max-w-[12ch]">Выберите нужный объём</h2>
          </Reveal>
          <div>
            <div className="hidden border-b border-ivory/20 pb-4 text-[11px] uppercase tracking-[0.08em] text-ivory/45 md:grid md:grid-cols-[40px_minmax(0,1fr)_170px] md:gap-4">
              <span />
              <span className="pl-4">Услуга</span>
              <span>Стоимость</span>
            </div>
            <RevealStagger className="border-t border-ivory/20 md:border-t-0">
              {resolvedPricing.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  data-reveal-item
                  className="grid gap-2 border-b border-ivory/15 py-7 md:grid-cols-[40px_minmax(0,1fr)_170px] md:items-center md:gap-4"
                >
                  <span className="text-[12px] uppercase tracking-[0.08em] text-ivory/40">{pad(index)}</span>
                  <h2 className="pl-0 font-normal tracking-[-0.02em] md:pl-4" style={{ fontSize: "24px", lineHeight: 1.3 }}>
                    {item.title}
                  </h2>
                  <p className="text-[18px] font-normal tracking-[-0.02em]">{item.price}</p>
                </article>
              ))}
            </RevealStagger>
            <Reveal delay={0.08}>
              <p className="mt-8 max-w-[490px] text-[13px] leading-relaxed text-ivory/55">
                Финальная стоимость зависит от объёма документов и сложности задачи и фиксируется в договоре.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <AdvantagesSection items={staticData.advantages} />

      <section id="practice" className="scroll-mt-24 bg-cream py-16 md:py-[150px]">
        <div className="container-x mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[384px_1fr] lg:gap-[112px]">
          <Reveal>
            <p className="text-[12px] uppercase tracking-[0.08em] text-ink/40">Практика</p>
            <h2 className="type-section-title mt-5 max-w-[12ch]">Что можем взять на себя</h2>
            <p className="mt-8 max-w-[34ch] text-[15px] leading-relaxed text-ink/50">
              Откройте направление, чтобы посмотреть состав работ.
            </p>
          </Reveal>
          <RevealStagger className="border-t border-ink/15">
            {resolvedScope.map((item, index) => {
              const open = openScope === index;
              return (
                <article key={`${item.question}-${index}`} data-reveal-item className="border-b border-ink/15">
                  <button
                    type="button"
                    onClick={() => setOpenScope(open ? -1 : index)}
                    className="flex w-full items-center gap-4 py-8 text-left font-normal"
                    aria-expanded={open}
                  >
                    <span className="w-10 shrink-0 text-[12px] tracking-[0.08em] text-ink/35">{pad(index)}</span>
                    <h2
                      className="min-w-0 flex-1 font-normal tracking-[-0.02em]"
                      style={{ fontSize: "24px", lineHeight: 1.3 }}
                    >
                      {item.question}
                    </h2>
                    <span className="w-6 shrink-0 text-center text-[24px] leading-none font-normal text-ink/45">
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  <AccordionPanel open={open} className="max-w-[52ch] pb-8 pl-14">
                    <p className="text-[15px] leading-relaxed text-ink/55">{item.answer}</p>
                  </AccordionPanel>
                </article>
              );
            })}
          </RevealStagger>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-wine py-16 text-ivory md:py-[150px]">
        <div className="container-x mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[384px_1fr] lg:gap-[112px]">
          <Reveal>
            <div className="flex flex-col">
              <p className="text-[12px] uppercase tracking-[0.08em] text-ivory/45">Вопрос / ответ</p>
              <h2 className="type-section-title mt-5 max-w-[10ch]">До начала работы</h2>
              <Link
                href="/#contacts"
                className="mt-auto inline-flex items-center gap-3 pt-16 text-[12px] font-normal uppercase tracking-[0.07em] text-ivory/80 hover:text-ivory"
              >
                Задать свой вопрос <span aria-hidden>↗</span>
              </Link>
            </div>
          </Reveal>
          <RevealStagger className="border-t border-ivory/20">
            {resolvedFaq.map((item, index) => {
              const open = openFaq === index;
              return (
                <article key={`${item.question}-${index}`} data-reveal-item className="border-b border-ivory/15">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    className="flex w-full items-start gap-4 py-8 text-left font-normal"
                    aria-expanded={open}
                  >
                    <h2
                      className="min-w-0 flex-1 font-normal tracking-[-0.02em] text-ivory"
                      style={{ fontSize: "24px", lineHeight: 1.35 }}
                    >
                      {item.question}
                    </h2>
                    <span className="w-6 shrink-0 text-center text-[24px] leading-none font-normal text-ivory/55">
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  <AccordionPanel open={open} className="max-w-[54ch] pb-8">
                    <p className="text-[15px] leading-relaxed text-ivory/70">{item.answer}</p>
                  </AccordionPanel>
                </article>
              );
            })}
          </RevealStagger>
        </div>
      </section>

      <CasesSection cases={resolvedCases} />

      <div className="border-t border-ink/10 bg-ivory">
        <div className="container-x mx-auto flex max-w-[1440px] items-center justify-between py-7 text-[12px] uppercase tracking-[0.07em] text-ink/45">
          <span className="truncate pr-4">{title}</span>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="shrink-0 font-normal hover:text-wine"
          >
            Наверх ↑
          </a>
        </div>
      </div>
    </div>
  );
}

function CasesSection({ cases }: { cases: ServiceCaseItem[] }) {
  const displayed = cases.slice(0, 3);
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
    document.body.style.overflow = "hidden";
    document.body.classList.add("case-popup-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
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

  const activeCase = openIndex !== null ? displayed[openIndex] : null;

  return (
    <section className="relative overflow-hidden bg-cream py-16 md:py-[150px]">
      <div className="container-x relative z-10 mx-auto max-w-[1440px]">
        <Reveal>
          <div className="max-w-[40ch]">
            <p className="text-[12px] uppercase tracking-[0.08em] text-ink/40">Дела</p>
            <h2 className="type-section-title mt-5">Задача/результат</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink/50">
              Откройте папку — лист выедет и покажет карточку дела.
            </p>
          </div>
        </Reveal>

        {displayed.length ? (
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-10">
            {displayed.map((item, index) => (
              <Reveal key={`${item.title}-${index}`} delay={index * 0.08}>
                <button
                  type="button"
                  onClick={() => openCase(index)}
                  className="group relative block w-full cursor-pointer text-left outline-none"
                  aria-label={`Открыть дело: ${item.title || `Дело ${pad(index)}`}`}
                >
                  <div className="relative mx-auto aspect-[5/4] w-full max-w-[340px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
                    {/* folder tab */}
                    <div className="absolute top-3 left-[14%] z-10 h-7 w-[38%] rounded-t-[6px] bg-[#6b1f2a]" />

                    {/* folder back */}
                    <div className="absolute inset-x-0 top-8 bottom-0 rounded-[4px] rounded-tl-none bg-[#5c1a24] shadow-[0_18px_40px_rgba(40,16,18,0.18)]" />

                    {/* paper — straight, mostly tucked into pocket */}
                    <div
                      ref={(node) => {
                        paperRefs.current[index] = node;
                      }}
                      className="absolute inset-x-[10%] top-[18%] bottom-[12%] z-20 origin-bottom bg-[#f7f1e8] shadow-[0_6px_18px_rgba(40,16,18,0.1)]"
                    >
                      <div className="flex h-full flex-col px-4 pt-4 pb-4 sm:px-5">
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/30">
                          Дело {pad(index)}
                        </span>
                        <p
                          className="mt-3 line-clamp-3 font-normal tracking-[-0.03em] text-ink"
                          style={{ fontSize: "18px", lineHeight: 1.25 }}
                        >
                          {item.title || "Без названия"}
                        </p>
                        <div className="mt-auto space-y-2 pt-4">
                          <span className="block h-px w-full bg-ink/10" />
                          <span className="block h-px w-[78%] bg-ink/8" />
                          <span className="block h-px w-[62%] bg-ink/8" />
                        </div>
                      </div>
                    </div>

                    {/* folder front pocket — higher so paper barely peeks */}
                    <div className="absolute inset-x-0 top-[30%] bottom-0 z-30 overflow-hidden rounded-b-[4px] bg-wine shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
                      <div className="absolute inset-x-5 bottom-5">
                        <p className="text-[10px] uppercase tracking-[0.1em] text-ivory/45">
                          {item.court || "Суд не указан"}
                        </p>
                        <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-ivory/85">
                          {item.result || item.role || "Открыть карточку"}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="mt-12">
            <div className="border border-dashed border-ink/15 px-8 py-20 text-center">
              <p className="text-[12px] uppercase tracking-[0.08em] text-ink/35">Пока пусто</p>
              <p className="mx-auto mt-4 max-w-[36ch] text-sm leading-relaxed text-ink/45">
                Добавьте до трёх дел в админке услуги — здесь появятся бордовые папки.
              </p>
            </div>
          </Reveal>
        )}
      </div>

      {activeCase && openIndex !== null ? (
        <div className="fixed inset-0 z-[110]">
          <div
            ref={modalRef}
            className="h-full w-full"
            style={{ opacity: 0 }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={activeCase.title || `Дело ${pad(openIndex)}`}
              data-lenis-prevent
              className="case-popup-scroll h-dvh w-full overflow-y-auto overscroll-contain bg-[#f7f1e8]"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between bg-[#f7f1e8]/95 px-5 py-4 backdrop-blur-sm sm:px-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/35">
                  Дело {pad(openIndex)}
                </p>
                <button
                  type="button"
                  onClick={closeCase}
                  className="h-10 px-3 text-[11px] font-normal uppercase tracking-[0.08em] text-ink/50 transition-colors hover:text-wine"
                >
                  Закрыть ✕
                </button>
              </div>

              <div className="px-5 py-8 pb-16 sm:px-10 sm:py-14 lg:px-16">
                <article className="mx-auto w-full max-w-[720px]">
                  <h2
                    className="font-normal tracking-[-0.04em] text-ink"
                    style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.15 }}
                  >
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
      <h3
        className="font-normal tracking-[-0.02em] text-ink"
        style={{ fontSize: "24px", lineHeight: 1.3 }}
      >
        {heading}
      </h3>
      <p className="mt-3 text-[16px] leading-relaxed tracking-[-0.01em] text-ink/70">
        {body || "—"}
      </p>
    </section>
  );
}
