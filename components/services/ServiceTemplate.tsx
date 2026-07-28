"use client";

import Link from "next/link";
import { useState } from "react";
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

  const [activeStep, setActiveStep] = useState(0);
  const [openScope, setOpenScope] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [caseIndex, setCaseIndex] = useState(0);

  const step = staticData.steps[activeStep];
  const activeCase = resolvedCases[caseIndex] ?? null;

  return (
    <div className="bg-ivory text-ink">
      <section className="border-t border-ink">
        <div className="container-x mx-auto max-w-[1440px]">
          <div className="flex flex-wrap gap-3 pt-6 pb-8 text-[12px] uppercase tracking-[0.07em] text-ink/40">
            <Link href="/services" className="hover:text-wine">
              Услуги
            </Link>
            <span>/</span>
            <span>{category}</span>
          </div>

          <div className="grid border-y border-ink lg:grid-cols-[1fr_312px]">
            <div className="relative flex min-h-[420px] flex-col justify-end py-10 pr-0 lg:min-h-[608px] lg:pr-[72px] lg:pb-14 lg:pt-10">
              <p className="absolute top-8 left-0 text-[13px] tracking-[0.08em] text-wine">
                01 — {pad(Math.max(resolvedScope.length - 1, 0))}
              </p>
              <h1
                className="max-w-[16ch] font-normal tracking-[-0.06em] text-ink"
                style={{ fontSize: "clamp(2.75rem, 7vw, 6rem)", lineHeight: 1 }}
              >
                {title}
              </h1>
            </div>

            <aside className="flex flex-col justify-end border-t border-ink px-0 py-10 lg:border-t-0 lg:border-l lg:px-11 lg:py-14">
              <p className="text-[12px] uppercase tracking-[0.08em] text-ink/40">Коротко об услуге</p>
              <p className="mt-auto pt-16 text-[18px] leading-[1.5] text-ink">
                {summary || staticData.fallbackSummary}
              </p>
              <a
                href="#formats"
                className="mt-8 inline-flex h-[58px] min-h-[58px] items-center justify-between bg-wine px-5 text-[12px] font-semibold uppercase tracking-[0.07em] text-cream"
              >
                Выбрать формат
                <span aria-hidden>↗</span>
              </a>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-[150px]">
        <div className="container-x mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[381px_1fr] lg:gap-[120px]">
          <div>
            <p className="text-[12px] uppercase tracking-[0.08em] text-ink/40">Принципы</p>
            <h2
              className="mt-5 max-w-[12ch] font-normal tracking-[-0.05em]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
            >
              Понятные правила работы
            </h2>
          </div>
          <div className="border-t border-ink/15">
            {staticData.principles.map((item, index) => (
              <article
                key={item.title}
                className="grid gap-4 border-b border-ink/15 py-8 md:grid-cols-[72px_minmax(0,1fr)_minmax(0,1.1fr)] md:items-start md:gap-7 md:py-10"
              >
                <span className="pt-2 text-[12px] uppercase tracking-[0.08em] text-ink/35">
                  {pad(index)}
                </span>
                <h3 className="font-normal tracking-[-0.03em]" style={{ fontSize: "24px", lineHeight: 1.25 }}>
                  {item.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-ink/55 md:pt-1">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="formats" className="scroll-mt-24 bg-wine py-16 text-ivory md:py-[150px]">
        <div className="container-x mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[395px_1fr] lg:gap-[110px]">
          <div>
            <p className="text-[12px] uppercase tracking-[0.08em] text-ivory/45">Формат сотрудничества</p>
            <h2
              className="mt-5 max-w-[12ch] font-normal tracking-[-0.05em]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
            >
              Выберите нужный объём
            </h2>
          </div>
          <div>
            <div className="hidden border-b border-ivory/20 pb-4 text-[11px] uppercase tracking-[0.08em] text-ivory/45 md:grid md:grid-cols-[40px_minmax(0,1fr)_170px] md:gap-4">
              <span />
              <span className="pl-4">Услуга</span>
              <span>Стоимость</span>
            </div>
            <div className="border-t border-ivory/20 md:border-t-0">
              {resolvedPricing.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="grid gap-2 border-b border-ivory/15 py-7 md:grid-cols-[40px_minmax(0,1fr)_170px] md:items-center md:gap-4"
                >
                  <span className="text-[12px] uppercase tracking-[0.08em] text-ivory/40">{pad(index)}</span>
                  <h3 className="pl-0 font-normal tracking-[-0.02em] md:pl-4" style={{ fontSize: "20px", lineHeight: 1.3 }}>
                    {item.title}
                  </h3>
                  <p className="text-[18px] font-medium tracking-[-0.02em]">{item.price}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 max-w-[490px] text-[13px] leading-relaxed text-ivory/55">
              Финальная стоимость зависит от объёма документов и сложности задачи и фиксируется в договоре.
            </p>
          </div>
        </div>
      </section>

      <section id="process" className="scroll-mt-24 bg-cream py-16 md:py-[150px]">
        <div className="container-x mx-auto max-w-[1440px]">
          <div className="grid gap-6 lg:grid-cols-[432px_1fr]">
            <p className="text-[12px] uppercase tracking-[0.08em] text-ink/40">Как мы работаем</p>
            <h2 className="max-w-[14ch] font-normal tracking-[-0.05em]" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}>
              Пять последовательных шагов
            </h2>
          </div>

          <div role="tablist" aria-label="Этапы работы" className="mt-12 grid border border-ink/15 md:grid-cols-5">
            {staticData.steps.map((item, index) => {
              const active = index === activeStep;
              return (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveStep(index)}
                  className={`min-h-[110px] border-ink/15 px-4 py-4 text-left transition-colors md:border-r md:last:border-r-0 ${
                    active ? "bg-ink text-ivory" : "bg-transparent text-ink hover:bg-ink/[0.04]"
                  } ${index > 0 ? "border-t md:border-t-0" : ""}`}
                >
                  <span className={`block text-[12px] tracking-[0.08em] ${active ? "text-ivory/45" : "text-ink/35"}`}>
                    {pad(index)}
                  </span>
                  <span className="mt-5 block text-[15px] leading-snug tracking-[-0.02em]">{item.title}</span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            className="grid gap-8 bg-wine px-6 py-12 text-ivory sm:px-10 md:grid-cols-[190px_minmax(0,1.4fr)_minmax(0,1fr)] md:items-end md:gap-10 md:px-14 md:py-16"
          >
            <p className="font-normal tracking-[-0.06em] text-ivory/90" style={{ fontSize: "clamp(3.5rem, 8vw, 5.5rem)", lineHeight: 1 }}>
              {pad(activeStep)}
            </p>
            <h3 className="max-w-[14ch] font-normal tracking-[-0.04em]" style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)", lineHeight: 1.1 }}>
              {step.title}
            </h3>
            <p className="max-w-[36ch] text-[16px] leading-relaxed text-ivory/75 md:justify-self-end">{step.text}</p>
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-ivory md:py-[150px]">
        <div className="container-x mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-[268px_minmax(0,1.4fr)_minmax(0,0.85fr)] lg:items-end">
            <p className="text-[12px] uppercase tracking-[0.08em] text-ivory/40">Преимущества</p>
            <h2 className="max-w-[16ch] font-normal tracking-[-0.05em]" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}>
              Снижаем риск процедурных ошибок
            </h2>
            <p className="max-w-[34ch] text-[14px] leading-relaxed text-ivory/55 lg:justify-self-end">
              Документы и рекомендации опираются на актуальные требования и практику по трудовым спорам.
            </p>
          </div>
          <div className="mt-16 grid gap-x-8 gap-y-14 border-t border-ivory/15 pt-12 sm:grid-cols-2">
            {staticData.advantages.map((item, index) => (
              <div key={item.title} className={index % 2 === 1 ? "sm:justify-self-end sm:text-right" : ""}>
                <p className="text-[12px] tracking-[0.08em] text-ivory/40">{pad(index)}</p>
                <p className="mt-2 font-normal tracking-[-0.04em]" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.05 }}>
                  {item.title}
                </p>
                <p className="mt-3 text-[14px] text-ivory/55">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="practice" className="scroll-mt-24 bg-cream py-16 md:py-[150px]">
        <div className="container-x mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[384px_1fr] lg:gap-[112px]">
          <div>
            <p className="text-[12px] uppercase tracking-[0.08em] text-ink/40">Практика</p>
            <h2 className="mt-5 max-w-[12ch] font-normal tracking-[-0.05em]" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}>
              Что можем взять на себя
            </h2>
            <p className="mt-8 max-w-[34ch] text-[15px] leading-relaxed text-ink/50">
              Откройте направление, чтобы посмотреть состав работ.
            </p>
          </div>
          <div className="border-t border-ink/15">
            {resolvedScope.map((item, index) => {
              const open = openScope === index;
              return (
                <article key={`${item.question}-${index}`} className="border-b border-ink/15">
                  <button type="button" onClick={() => setOpenScope(open ? -1 : index)} className="flex w-full items-center gap-4 py-8 text-left" aria-expanded={open}>
                    <span className="w-10 shrink-0 text-[12px] tracking-[0.08em] text-ink/35">{pad(index)}</span>
                    <span className="min-w-0 flex-1 font-normal tracking-[-0.02em]" style={{ fontSize: "20px", lineHeight: 1.3 }}>
                      {item.question}
                    </span>
                    <span className="w-6 shrink-0 text-center text-[24px] leading-none text-ink/45">{open ? "−" : "+"}</span>
                  </button>
                  {open && item.answer ? (
                    <p className="max-w-[52ch] pb-8 pl-14 text-[15px] leading-relaxed text-ink/55">{item.answer}</p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-wine py-16 text-ivory md:py-[150px]">
        <div className="container-x mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[384px_1fr] lg:gap-[112px]">
          <div className="flex flex-col">
            <p className="text-[12px] uppercase tracking-[0.08em] text-ivory/45">Вопрос / ответ</p>
            <h2 className="mt-5 max-w-[10ch] font-normal tracking-[-0.05em]" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}>
              До начала работы
            </h2>
            <Link href="/#contacts" className="mt-auto inline-flex items-center gap-3 pt-16 text-[12px] uppercase tracking-[0.07em] text-ivory/80 hover:text-ivory">
              Задать свой вопрос <span aria-hidden>↗</span>
            </Link>
          </div>
          <div className="border-t border-ivory/20">
            {resolvedFaq.map((item, index) => {
              const open = openFaq === index;
              return (
                <article key={`${item.question}-${index}`} className="border-b border-ivory/15">
                  <button type="button" onClick={() => setOpenFaq(open ? -1 : index)} className="flex w-full items-start gap-4 py-8 text-left" aria-expanded={open}>
                    <span className="min-w-0 flex-1 font-normal tracking-[-0.02em]" style={{ fontSize: "20px", lineHeight: 1.35 }}>
                      {item.question}
                    </span>
                    <span className="w-6 shrink-0 text-center text-[24px] leading-none text-ivory/55">{open ? "−" : "+"}</span>
                  </button>
                  {open && item.answer ? (
                    <p className="max-w-[54ch] pb-8 text-[15px] leading-relaxed text-ivory/70">{item.answer}</p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-[150px]">
        <div className="container-x mx-auto max-w-[1440px]">
          {activeCase ? (
            <div className="grid border border-ink/15 lg:grid-cols-[295px_1fr]">
              <div className="flex flex-col justify-between border-b border-ink/15 p-8 lg:border-r lg:border-b-0 lg:p-8">
                <p className="text-[12px] uppercase tracking-[0.08em] text-ink/40">дела</p>
                <div className="flex gap-0 pt-16 lg:pt-0">
                  <button
                    type="button"
                    aria-label="Предыдущее дело"
                    onClick={() => setCaseIndex((prev) => (prev - 1 + resolvedCases.length) % resolvedCases.length)}
                    className="flex h-[58px] w-[58px] items-center justify-center border border-ink/15 text-[20px] hover:bg-ink hover:text-ivory"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Следующее дело"
                    onClick={() => setCaseIndex((prev) => (prev + 1) % resolvedCases.length)}
                    className="flex h-[58px] w-[58px] items-center justify-center border border-l-0 border-ink/15 text-[20px] hover:bg-ink hover:text-ivory"
                  >
                    →
                  </button>
                </div>
                <p className="pt-10 font-normal tracking-[-0.04em] text-ink/35" style={{ fontSize: "40px", lineHeight: 1 }}>
                  {pad(caseIndex)} / {String(resolvedCases.length).padStart(2, "0")}
                </p>
              </div>
              <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-3 lg:p-14">
                <CaseField label="Название" value={activeCase.title} />
                <CaseField label="Суд" value={activeCase.court} />
                <CaseField label="Роль" value={activeCase.role} />
                <CaseField label="Сложность" value={activeCase.complexity} />
                <CaseField label="Что сделали" value={activeCase.whatDone} />
                <CaseField label="Результат" value={activeCase.result} />
              </div>
            </div>
          ) : (
            <div className="border border-ink/15 px-8 py-16 text-center text-sm text-ink/40">
              Дела пока не добавлены. Их можно заполнить в админке услуги.
            </div>
          )}
        </div>
      </section>

      <div className="border-t border-ink/10 bg-ivory">
        <div className="container-x mx-auto flex max-w-[1440px] items-center justify-between py-7 text-[12px] uppercase tracking-[0.07em] text-ink/45">
          <span className="truncate pr-4">{title}</span>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="shrink-0 hover:text-wine"
          >
            Наверх ↑
          </a>
        </div>
      </div>
    </div>
  );
}

function CaseField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.08em] text-ink/35">{label}</p>
      <p className="mt-2 text-[16px] leading-snug tracking-[-0.02em] text-ink">{value || "—"}</p>
    </div>
  );
}
