"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { saveServiceAction } from "@/app/admin/actions";

type ServiceEditorFormProps = {
  service?: {
    id: string;
    title: string;
    category: string;
    summary: string;
    published: boolean;
  };
};

export function ServiceEditorForm({ service }: ServiceEditorFormProps) {
  const [title, setTitle] = useState(service?.title ?? "");
  const [category, setCategory] = useState(service?.category ?? "");
  const [summary, setSummary] = useState(service?.summary ?? "");
  const [published, setPublished] = useState(service?.published ?? false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const save = () => {
    setError("");
    startTransition(async () => {
      try {
        await saveServiceAction({ id: service?.id, title, category, summary, published });
      } catch (cause) {
        if (cause instanceof Error && cause.message === "NEXT_REDIRECT") throw cause;
        setError(cause instanceof Error ? cause.message : "Не удалось сохранить услугу.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink/10 bg-cream/95 px-4 backdrop-blur sm:px-7 lg:px-10">
        <Link href="/admin/services" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.07em] text-ink/45 hover:text-wine"><ArrowLeft size={14} strokeWidth={1.4} /> К списку</Link>
        <button type="button" onClick={save} disabled={pending} className="inline-flex h-10 items-center gap-2 bg-wine px-5 text-[10px] uppercase tracking-[0.07em] text-ivory hover:bg-wine-deep disabled:opacity-50"><Check size={14} strokeWidth={1.5} />{pending ? "Сохраняем…" : "Сохранить"}</button>
      </header>
      <div className="mx-auto max-w-[940px] px-4 py-10 sm:px-7 lg:py-14">
        <p className="text-[10px] uppercase tracking-[0.1em] text-wine">{service ? "Редактирование услуги" : "Новая услуга"}</p>
        <textarea value={title} onChange={(event) => setTitle(event.target.value)} rows={2} placeholder="Название услуги" className="mt-4 w-full resize-none bg-transparent text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.94] tracking-[-0.07em] outline-none placeholder:text-ink/18" />
        <div className="mt-8 border border-ink/10 bg-ivory p-5 sm:p-7">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <label className="block"><span className="mb-2 block text-[9px] uppercase tracking-[0.09em] text-ink/38">Категория</span><input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Например, Для бизнеса" className="h-11 w-full border border-ink/12 bg-transparent px-3 text-sm outline-none focus:border-wine" /></label>
            <label className="flex h-11 cursor-pointer items-center gap-3 border border-ink/12 px-4"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} className="h-4 w-4 accent-[#431c26]" /><span className="text-[10px] uppercase tracking-[0.06em] text-ink/55">Опубликовать</span></label>
          </div>
          <label className="mt-6 block"><span className="mb-2 block text-[9px] uppercase tracking-[0.09em] text-ink/38">Описание</span><textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={8} placeholder="Кратко опишите услугу. Расширенный редактор будет добавлен позднее." className="w-full resize-y border border-ink/12 bg-transparent p-4 text-sm leading-relaxed outline-none focus:border-wine" /></label>
          <p className="mt-3 text-[10px] leading-relaxed text-ink/32">Редактор содержимого для услуг будет подключён отдельным этапом.</p>
        </div>
        {error ? <p role="alert" className="mt-5 border-l-2 border-wine pl-3 text-xs text-wine">{error}</p> : null}
      </div>
    </div>
  );
}
