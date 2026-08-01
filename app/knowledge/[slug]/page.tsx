import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { ArticleDetail } from "@/components/content/ArticleDetail";
import { formatContentDate } from "@/lib/content";
import { getPublishedArticle } from "@/lib/server/content-repository";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  return { title: `${article.title} — Астерия`, description: article.excerpt ?? undefined };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);

  return (
    <>
      <AppHeader />
      <main className="bg-ivory pt-28 pb-20 md:pt-36 md:pb-28">
        <ArticleDetail
          title={article.title}
          category={article.category}
          excerpt={article.excerpt}
          previewImage={article.previewImage}
          publishedLabel={formatContentDate(article.publishedAt ?? article.updatedAt)}
          content={article.content}
        />
      </main>
      <Footer />
    </>
  );
}
