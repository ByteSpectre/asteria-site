"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import { AsteriaEditor } from "@/components/editor/AsteriaEditor";
import { isSafePreviewImageUrl } from "@/lib/safe-url";

type ArticleDetailProps = {
  title: string;
  category: string;
  excerpt?: string | null;
  previewImage?: string | null;
  publishedLabel: string;
  content: unknown;
};

export function ArticleDetail({
  title,
  category,
  excerpt,
  previewImage,
  publishedLabel,
  content,
}: ArticleDetailProps) {
  const safePreview =
    previewImage && isSafePreviewImageUrl(previewImage) ? previewImage : null;

  return (
    <article className="container-x mx-auto max-w-[1440px]">
      <Reveal>
        <Link
          href="/knowledge"
          className="text-[10px] uppercase tracking-[0.08em] text-ink/42 hover:text-wine"
        >
          ← Все статьи
        </Link>
      </Reveal>

      {safePreview ? (
        <Reveal delay={0.06} className="mt-10">
          <div className="aspect-[21/9] overflow-hidden border border-ink/8 bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={safePreview} alt="" className="h-full w-full object-cover" />
          </div>
        </Reveal>
      ) : null}

      <Reveal delay={safePreview ? 0.1 : 0.06}>
        <header
          className={
            safePreview
              ? "mt-8 border-b border-ink/10 pb-10"
              : "mt-10 border-b border-ink/10 pb-10"
          }
        >
          <p className="eyebrow text-wine">{category}</p>
          <h1 className="mt-5 text-[clamp(3rem,7vw,7rem)] leading-[0.92] tracking-[-0.075em]">
            {title}
          </h1>
          {excerpt ? (
            <p className="mt-7 max-w-[58ch] text-lg leading-relaxed text-ink/55">
              {excerpt}
            </p>
          ) : null}
          <p className="mt-7 text-[10px] uppercase tracking-[0.08em] text-ink/32">
            {publishedLabel} · Астерия
          </p>
        </header>
      </Reveal>

      <Reveal delay={0.12} className="mt-12">
        <AsteriaEditor initialValue={content} readOnly />
      </Reveal>
    </article>
  );
}
