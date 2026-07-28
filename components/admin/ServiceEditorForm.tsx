"use client";

import Link from "next/link";
import { useState, useTransition, type ReactNode } from "react";
import { ArrowLeft, Check, Plus, Trash2 } from "lucide-react";
import { saveServiceAction } from "@/app/admin/actions";
import { getServiceValidationMessage } from "@/lib/content-validation";
import {
  emptyCaseItem,
  emptyPriceItem,
  emptyQaItem,
  normalizeServiceCases,
  normalizeServicePricing,
  normalizeServiceQa,
  type ServiceCaseItem,
  type ServicePriceItem,
  type ServiceQaItem,
} from "@/lib/service-content";
import { SERVICE_TEMPLATE_DEFAULTS } from "@/lib/service-template-defaults";

type ServiceEditorFormProps = {
  service?: {
    id: string;
    title: string;
    category: string;
    summary: string;
    pricing: unknown;
    scopeItems: unknown;
    faqItems: unknown;
    cases: unknown;
    published: boolean;
  };
};

function isRedirectError(cause: unknown) {
  return (
    typeof cause === "object" &&
    cause !== null &&
    "digest" in cause &&
    typeof (cause as { digest?: unknown }).digest === "string" &&
    String((cause as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

function initialPricing(value: unknown) {
  const items = normalizeServicePricing(value);
  return items.length ? items : SERVICE_TEMPLATE_DEFAULTS.pricing.map((item) => ({ ...item }));
}

function initialScope(value: unknown) {
  const items = normalizeServiceQa(value);
  return items.length
    ? items
    : SERVICE_TEMPLATE_DEFAULTS.scope.map((item) => ({
        question: item.title,
        answer: item.text,
      }));
}

function initialFaq(value: unknown) {
  const items = normalizeServiceQa(value);
  return items.length ? items : SERVICE_TEMPLATE_DEFAULTS.faq.map((item) => ({ ...item }));
}

function initialCases(value: unknown) {
  const items = normalizeServiceCases(value);
  return items.length ? items : [emptyCaseItem()];
}

export function ServiceEditorForm({ service }: ServiceEditorFormProps) {
  const [title, setTitle] = useState(service?.title ?? "");
  const [category, setCategory] = useState(service?.category ?? "");
  const [summary, setSummary] = useState(service?.summary ?? "");
  const [pricing, setPricing] = useState<ServicePriceItem[]>(() => initialPricing(service?.pricing));
  const [scopeItems, setScopeItems] = useState<ServiceQaItem[]>(() => initialScope(service?.scopeItems));
  const [faqItems, setFaqItems] = useState<ServiceQaItem[]>(() => initialFaq(service?.faqItems));
  const [cases, setCases] = useState<ServiceCaseItem[]>(() => initialCases(service?.cases));
  const [published, setPublished] = useState(service?.published ?? false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const save = () => {
    const payload = {
      id: service?.id,
      title,
      category,
      summary,
      pricing: pricing.filter((item) => item.title.trim() || item.price.trim()),
      scopeItems: scopeItems.filter((item) => item.question.trim() || item.answer.trim()),
      faqItems: faqItems.filter((item) => item.question.trim() || item.answer.trim()),
      cases: cases.filter(
        (item) =>
          item.title.trim() ||
          item.court.trim() ||
          item.role.trim() ||
          item.complexity.trim() ||
          item.whatDone.trim() ||
          item.result.trim(),
      ),
      published,
    };
    const validationError = getServiceValidationMessage(payload);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    startTransition(async () => {
      try {
        await saveServiceAction(payload);
      } catch (cause) {
        if (isRedirectError(cause)) throw cause;
        setError(cause instanceof Error ? cause.message : "Не удалось сохранить услугу.");
      }
    });
  };

  return (
    <div className="admin-editor min-h-screen bg-cream">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink/10 bg-cream/95 px-4 backdrop-blur sm:px-7 lg:px-10">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.07em] text-ink/45 hover:text-wine"
        >
          <ArrowLeft size={14} strokeWidth={1.4} /> К списку
        </Link>
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="inline-flex h-10 items-center gap-2 bg-wine px-5 text-[10px] uppercase tracking-[0.07em] text-ivory hover:bg-wine-deep disabled:opacity-50"
        >
          <Check size={14} strokeWidth={1.5} />
          {pending ? "Сохраняем…" : "Сохранить"}
        </button>
      </header>

      <div className="mx-auto max-w-[1440px] space-y-8 px-4 py-10 sm:px-7 lg:px-10 lg:py-14">
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-wine">
            {service ? "Редактирование услуги" : "Новая услуга"}
          </p>
          <textarea
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            rows={2}
            placeholder="Название услуги"
            className="mt-4 w-full resize-none bg-transparent text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.94] tracking-[-0.07em] outline-none placeholder:text-ink/18"
          />
        </div>

        <section className="border border-ink/10 bg-ivory p-5 sm:p-7">
          <p className="text-[10px] uppercase tracking-[0.09em] text-ink/38">Услуга</p>
          <div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-[0.09em] text-ink/38">
                Категория
              </span>
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Например, Для бизнеса"
                className="h-11 w-full border border-ink/12 bg-ivory px-3 text-sm outline-none focus:border-ink/12 focus-visible:outline-none focus-visible:ring-0"
              />
            </label>
            <label className="flex h-11 cursor-pointer items-center gap-3 border border-ink/12 px-4">
              <input
                type="checkbox"
                checked={published}
                onChange={(event) => setPublished(event.target.checked)}
                className="h-4 w-4 accent-[#431c26]"
              />
              <span className="text-[10px] uppercase tracking-[0.06em] text-ink/55">Опубликовать</span>
            </label>
          </div>
          <label className="mt-6 block">
            <span className="mb-2 block text-[9px] uppercase tracking-[0.09em] text-ink/38">
              Краткое описание
            </span>
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              rows={4}
              placeholder="Коротко об услуге"
              className="w-full resize-y border border-ink/12 bg-ivory p-4 text-sm leading-relaxed outline-none focus:border-ink/12 focus-visible:outline-none focus-visible:ring-0"
            />
          </label>
        </section>

        <RepeatSection
          title="Прайс"
          onAdd={() => setPricing((prev) => [...prev, emptyPriceItem()])}
        >
          {pricing.map((item, index) => (
            <div key={`price-${index}`} className="grid gap-3 border border-ink/10 p-4 md:grid-cols-[1fr_220px_auto]">
              <input
                value={item.title}
                onChange={(event) =>
                  setPricing((prev) =>
                    prev.map((row, rowIndex) =>
                      rowIndex === index ? { ...row, title: event.target.value } : row,
                    ),
                  )
                }
                placeholder="Название"
                className="h-11 border border-ink/12 bg-ivory px-3 text-sm outline-none"
              />
              <input
                value={item.price}
                onChange={(event) =>
                  setPricing((prev) =>
                    prev.map((row, rowIndex) =>
                      rowIndex === index ? { ...row, price: event.target.value } : row,
                    ),
                  )
                }
                placeholder="Сколько"
                className="h-11 border border-ink/12 bg-ivory px-3 text-sm outline-none"
              />
              <button
                type="button"
                aria-label="Удалить позицию"
                onClick={() => setPricing((prev) => prev.filter((_, rowIndex) => rowIndex !== index))}
                className="inline-flex h-11 w-11 items-center justify-center border border-ink/12 text-ink/45 hover:border-wine hover:text-wine"
              >
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </RepeatSection>

        <RepeatSection
          title="Что можем взять на себя"
          onAdd={() => setScopeItems((prev) => [...prev, emptyQaItem()])}
        >
          {scopeItems.map((item, index) => (
            <QaEditor
              key={`scope-${index}`}
              item={item}
              onChange={(next) =>
                setScopeItems((prev) =>
                  prev.map((row, rowIndex) => (rowIndex === index ? next : row)),
                )
              }
              onRemove={() =>
                setScopeItems((prev) => prev.filter((_, rowIndex) => rowIndex !== index))
              }
            />
          ))}
        </RepeatSection>

        <RepeatSection
          title="До начала работы"
          onAdd={() => setFaqItems((prev) => [...prev, emptyQaItem()])}
        >
          {faqItems.map((item, index) => (
            <QaEditor
              key={`faq-${index}`}
              item={item}
              onChange={(next) =>
                setFaqItems((prev) =>
                  prev.map((row, rowIndex) => (rowIndex === index ? next : row)),
                )
              }
              onRemove={() =>
                setFaqItems((prev) => prev.filter((_, rowIndex) => rowIndex !== index))
              }
            />
          ))}
        </RepeatSection>

        <RepeatSection title="Дела" onAdd={() => setCases((prev) => [...prev, emptyCaseItem()])}>
          {cases.map((item, index) => (
            <div key={`case-${index}`} className="space-y-3 border border-ink/10 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Field
                  label="Название"
                  value={item.title}
                  onChange={(value) =>
                    setCases((prev) =>
                      prev.map((row, rowIndex) =>
                        rowIndex === index ? { ...row, title: value } : row,
                      ),
                    )
                  }
                />
                <Field
                  label="Суд"
                  value={item.court}
                  onChange={(value) =>
                    setCases((prev) =>
                      prev.map((row, rowIndex) =>
                        rowIndex === index ? { ...row, court: value } : row,
                      ),
                    )
                  }
                />
                <Field
                  label="Роль"
                  value={item.role}
                  onChange={(value) =>
                    setCases((prev) =>
                      prev.map((row, rowIndex) =>
                        rowIndex === index ? { ...row, role: value } : row,
                      ),
                    )
                  }
                />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Field
                  label="Сложность"
                  value={item.complexity}
                  onChange={(value) =>
                    setCases((prev) =>
                      prev.map((row, rowIndex) =>
                        rowIndex === index ? { ...row, complexity: value } : row,
                      ),
                    )
                  }
                />
                <Field
                  label="Что сделали"
                  value={item.whatDone}
                  onChange={(value) =>
                    setCases((prev) =>
                      prev.map((row, rowIndex) =>
                        rowIndex === index ? { ...row, whatDone: value } : row,
                      ),
                    )
                  }
                />
                <Field
                  label="Результат"
                  value={item.result}
                  onChange={(value) =>
                    setCases((prev) =>
                      prev.map((row, rowIndex) =>
                        rowIndex === index ? { ...row, result: value } : row,
                      ),
                    )
                  }
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCases((prev) => prev.filter((_, rowIndex) => rowIndex !== index))}
                  className="inline-flex h-10 items-center gap-2 border border-ink/12 px-3 text-[10px] uppercase tracking-[0.06em] text-ink/45 hover:border-wine hover:text-wine"
                >
                  <Trash2 size={13} strokeWidth={1.5} />
                  Удалить дело
                </button>
              </div>
            </div>
          ))}
        </RepeatSection>

        {error ? (
          <p role="alert" className="border-l-2 border-wine pl-3 text-sm leading-relaxed text-wine">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function RepeatSection({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <section className="border border-ink/10 bg-ivory p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.09em] text-ink/38">{title}</p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 items-center gap-2 border border-ink/12 px-3 text-[10px] uppercase tracking-[0.06em] text-ink/55 hover:border-ink/25 hover:text-ink"
        >
          <Plus size={14} strokeWidth={1.6} />
          Добавить
        </button>
      </div>
      <div className="mt-5 space-y-3">{children}</div>
    </section>
  );
}

function QaEditor({
  item,
  onChange,
  onRemove,
}: {
  item: ServiceQaItem;
  onChange: (item: ServiceQaItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid gap-3 border border-ink/10 p-4 md:grid-cols-[1fr_1fr_auto]">
      <input
        value={item.question}
        onChange={(event) => onChange({ ...item, question: event.target.value })}
        placeholder="Вопрос"
        className="h-11 border border-ink/12 bg-ivory px-3 text-sm outline-none"
      />
      <input
        value={item.answer}
        onChange={(event) => onChange({ ...item, answer: event.target.value })}
        placeholder="Ответ"
        className="h-11 border border-ink/12 bg-ivory px-3 text-sm outline-none"
      />
      <button
        type="button"
        aria-label="Удалить"
        onClick={onRemove}
        className="inline-flex h-11 w-11 items-center justify-center border border-ink/12 text-ink/45 hover:border-wine hover:text-wine"
      >
        <Trash2 size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] uppercase tracking-[0.09em] text-ink/38">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full border border-ink/12 bg-ivory px-3 text-sm outline-none"
      />
    </label>
  );
}
