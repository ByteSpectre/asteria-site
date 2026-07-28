import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { KnowledgeIndex } from "@/components/content/KnowledgeIndex";
import { formatContentDate } from "@/lib/content";
import { listPublishedArticles } from "@/lib/server/content-repository";

export const metadata: Metadata = {
  title: "База знаний — Астерия",
  description: "Статьи, разборы судебной практики и ответы юристов агентства Астерия.",
};
export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const articles = await listPublishedArticles();
  const items = articles.map((article) => ({
    id: article.id,
    title: article.title,
    category: article.category,
    excerpt: article.excerpt ?? undefined,
    previewImage: article.previewImage,
    date: formatContentDate(article.publishedAt ?? article.updatedAt),
    href: `/knowledge/${article.slug}`,
  }));

  return (
    <>
      <Header />
      <main className="min-h-[75svh] bg-cream pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <header className="grid gap-6 border-b border-ink/10 pb-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="eyebrow text-wine">Материалы агентства</p>
              <h1 className="mt-5 text-[clamp(3.2rem,7vw,7.5rem)] leading-[0.9] tracking-[-0.075em]">
                База знаний
              </h1>
            </div>
            <p className="max-w-[50ch] text-sm leading-relaxed text-ink/48 lg:justify-self-end">
              Разбираем изменения в законодательстве, судебную практику и ситуации, с которыми
              сталкиваются люди и бизнес.
            </p>
          </header>
          <div className="mt-10">
            <KnowledgeIndex articles={items} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
