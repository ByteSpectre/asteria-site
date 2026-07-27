import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AsteriaEditor } from "@/components/editor/AsteriaEditor";
import { formatContentDate } from "@/lib/content";
import { getPublishedArticle } from "@/lib/server/content-repository";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  return { title: `${article.title} — Астерия`, description: article.excerpt ?? undefined };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);

  return (
    <>
      <Header />
      <main className="bg-ivory pt-28 pb-20 md:pt-36 md:pb-28">
        <article className="container-x mx-auto max-w-[1040px]">
          <Link href="/knowledge" className="text-[10px] uppercase tracking-[0.08em] text-ink/42 hover:text-wine">← Все статьи</Link>
          <header className="mt-10 border-b border-ink/10 pb-10">
            <p className="eyebrow text-wine">{article.category}</p>
            <h1 className="mt-5 text-[clamp(3rem,7vw,7rem)] leading-[0.92] tracking-[-0.075em]">{article.title}</h1>
            {article.excerpt ? <p className="mt-7 max-w-[58ch] text-lg leading-relaxed text-ink/55">{article.excerpt}</p> : null}
            <p className="mt-7 text-[10px] uppercase tracking-[0.08em] text-ink/32">{formatContentDate(article.publishedAt ?? article.updatedAt)} · Астерия</p>
          </header>
          <div className="mx-auto mt-12 max-w-[800px]"><AsteriaEditor initialValue={article.content} readOnly /></div>
        </article>
      </main>
      <Footer />
    </>
  );
}
