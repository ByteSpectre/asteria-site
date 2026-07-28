import type { Metadata } from "next";
import { ArticleEditorForm } from "@/components/admin/ArticleEditorForm";
import { listArticleCategories } from "@/lib/server/content-repository";

export const metadata: Metadata = { title: "Новая статья — Управление Астерия" };

export default async function NewArticlePage() {
  const categories = await listArticleCategories();
  return <ArticleEditorForm categories={categories} />;
}
