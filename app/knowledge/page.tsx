import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { AnimatedPageHeader } from "@/components/content/AnimatedPageHeader";
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
      <AppHeader />
      <main className="min-h-[75svh] bg-cream pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <AnimatedPageHeader
            eyebrow="Материалы агентства"
            title="База знаний"
            description="Разбираем изменения в законодательстве, судебную практику и ситуации, с которыми сталкиваются люди и бизнес."
          />
          <div className="mt-10">
            <KnowledgeIndex articles={items} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
