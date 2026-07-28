import type { Metadata } from "next";
import { ArticleEditorForm } from "@/components/admin/ArticleEditorForm";
import { getArticleForAdmin, listArticleCategories } from "@/lib/server/content-repository";

export const metadata: Metadata = { title: "Редактирование статьи — Управление Астерия" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    getArticleForAdmin(id),
    listArticleCategories(),
  ]);

  return <ArticleEditorForm categories={categories} article={{ id: article.id, title: article.title, category: article.category, excerpt: article.excerpt ?? "", previewImage: article.previewImage ?? "", content: article.content, published: article.status === "PUBLISHED", publicHref: `/knowledge/${article.slug}` }} />;
}
