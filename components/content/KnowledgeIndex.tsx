"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import RevealStagger from "@/components/RevealStagger";
import { parseCategoryList } from "@/lib/category-list";

export type KnowledgeArticleCard = {
  id: string;
  title: string;
  category: string;
  excerpt?: string;
  previewImage?: string | null;
  date: string;
  href: string;
};

type KnowledgeIndexProps = {
  articles: KnowledgeArticleCard[];
};

export function KnowledgeIndex({ articles }: KnowledgeIndexProps) {
  const [activeCategory, setActiveCategory] = useState("Все");

  const categories = useMemo(() => {
    const names = Array.from(
      new Set(articles.flatMap((article) => parseCategoryList(article.category))),
    ).sort((a, b) => a.localeCompare(b, "ru"));
    return ["Все", ...names];
  }, [articles]);

  const visible = useMemo(() => {
    if (activeCategory === "Все") return articles;
    return articles.filter((article) =>
      parseCategoryList(article.category).includes(activeCategory),
    );
  }, [activeCategory, articles]);

  return (
    <section className="public-content">
      <Reveal>
        <div className="flex flex-wrap gap-2 border-b border-ink/10 pb-8">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={
                  isActive
                    ? "h-10 bg-wine px-4 text-[10px] uppercase tracking-[0.08em] text-ivory transition-colors"
                    : "h-10 border border-ink/12 bg-ivory px-4 text-[10px] uppercase tracking-[0.08em] text-ink/55 transition-colors hover:border-ink/25 hover:text-ink"
                }
                aria-pressed={isActive}
              >
                {category}
              </button>
            );
          })}
        </div>
      </Reveal>

      {visible.length ? (
        <RevealStagger
          deps={[activeCategory, visible.map((item) => item.id).join(",")]}
          className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((article) => {
            const categoriesLabel = parseCategoryList(article.category).join(" · ");
            return (
              <Link
                key={article.id}
                href={article.href}
                data-reveal-item
                className="group flex flex-col outline-none transition-opacity hover:opacity-95"
              >
                <div className="relative aspect-[16/10] overflow-hidden border border-ink/8 bg-cream">
                  {article.previewImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.previewImage}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-end p-5"
                      style={{
                        background:
                          "linear-gradient(145deg, color-mix(in srgb, var(--color-cream) 55%, var(--color-ink)), color-mix(in srgb, var(--color-wine) 42%, var(--color-cream)))",
                      }}
                    >
                      <span className="text-[clamp(1.6rem,3vw,2.4rem)] leading-none tracking-[-0.06em] text-ivory/80">
                        {article.title.slice(0, 1)}
                      </span>
                    </div>
                  )}
                </div>

                <h2
                  className="mt-5 font-normal text-ink transition-colors group-hover:text-wine"
                  style={{ fontSize: "24px", lineHeight: 1.25, letterSpacing: "-0.04em" }}
                >
                  {article.title}
                </h2>

                {article.excerpt ? (
                  <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink/48">
                    {article.excerpt}
                  </p>
                ) : null}

                <p className="mt-4 text-[10px] uppercase tracking-[0.08em] text-ink/35">
                  {categoriesLabel}
                  {categoriesLabel ? " · " : ""}
                  {article.date}
                </p>
              </Link>
            );
          })}
        </RevealStagger>
      ) : (
        <Reveal className="mt-16">
          <div className="flex min-h-[240px] items-center justify-center text-sm text-ink/40">
            {activeCategory === "Все"
              ? "Опубликованных статей пока нет."
              : "В этой категории пока нет статей."}
          </div>
        </Reveal>
      )}
    </section>
  );
}
