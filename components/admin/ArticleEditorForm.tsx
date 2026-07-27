"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { saveArticleAction } from "@/app/admin/actions";
import { AsteriaEditor } from "@/components/editor/AsteriaEditor";
import { normalizeArticleContent } from "@/lib/article-content";

type ArticleEditorFormProps = {
  article?: {
    id: string;
    title: string;
    category: string;
    excerpt: string;
    content: unknown;
    published: boolean;
    publicHref: string;
  };
};

export function ArticleEditorForm({ article }: ArticleEditorFormProps) {
  const [title, setTitle] = useState(article?.title ?? "");
  const [category, setCategory] = useState(article?.category ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [published, setPublished] = useState(article?.published ?? false);
  const [content, setContent] = useState(() => normalizeArticleContent(article?.content));
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const save = () => {
    setError("");
    startTransition(async () => {
      try {
        await saveArticleAction({ id: article?.id, title, category, excerpt, content, published });
      } catch (cause) {
        if (cause instanceof Error && cause.message === "NEXT_REDIRECT") throw cause;
        setError(cause instanceof Error ? cause.message : "Не удалось сохранить статью.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink/10 bg-cream/95 px-4 backdrop-blur sm:px-7 lg:px-10">
        <Link href="/admin/knowledge" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.07em] text-ink/45 hover:text-wine"><ArrowLeft size={14} strokeWidth={1.4} /> К списку</Link>
        <div className="flex items-center gap-2">
          {article?.published ? <Link href={article.publicHref} target="_blank" aria-label="Открыть статью" className="flex h-10 w-10 items-center justify-center border border-ink/12 text-ink/45 hover:border-wine hover:text-wine"><ExternalLink size={14} strokeWidth={1.4} /></Link> : null}
          <button type="button" onClick={save} disabled={pending} className="inline-flex h-10 items-center gap-2 bg-wine px-5 text-[10px] uppercase tracking-[0.07em] text-ivory hover:bg-wine-deep disabled:opacity-50"><Check size={14} strokeWidth={1.5} />{pending ? "Сохраняем…" : "Сохранить"}</button>
        </div>
      </header>

      <div className="mx-auto max-w-[1040px] px-4 py-10 sm:px-7 lg:py-14">
        <p className="text-[10px] uppercase tracking-[0.1em] text-wine">{article ? "Редактирование статьи" : "Новая статья"}</p>
        <textarea value={title} onChange={(event) => setTitle(event.target.value)} rows={2} placeholder="Название статьи" className="mt-4 w-full resize-none bg-transparent text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.94] tracking-[-0.07em] outline-none placeholder:text-ink/18" />

        <div className="mt-7 grid gap-4 border-y border-ink/10 py-5 md:grid-cols-[1fr_1.5fr_auto] md:items-end">
          <label className="block"><span className="mb-2 block text-[9px] uppercase tracking-[0.09em] text-ink/38">Категория</span><input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Например, Судебная практика" className="h-11 w-full border border-ink/12 bg-ivory px-3 text-sm outline-none focus:border-wine" /></label>
          <label className="block"><span className="mb-2 block text-[9px] uppercase tracking-[0.09em] text-ink/38">Краткое описание</span><input value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder="О чём этот материал" className="h-11 w-full border border-ink/12 bg-ivory px-3 text-sm outline-none focus:border-wine" /></label>
          <label className="flex h-11 cursor-pointer items-center gap-3 border border-ink/12 bg-ivory px-4"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} className="h-4 w-4 accent-[#431c26]" /><span className="text-[10px] uppercase tracking-[0.06em] text-ink/55">Опубликовать</span></label>
        </div>

        {error ? <p role="alert" className="mt-5 border-l-2 border-wine pl-3 text-xs text-wine">{error}</p> : null}
        <div className="mt-8"><AsteriaEditor initialValue={article?.content} onChange={setContent} /></div>
      </div>
    </div>
  );
}
