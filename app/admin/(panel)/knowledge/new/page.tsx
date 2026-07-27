import type { Metadata } from "next";
import { ArticleEditorForm } from "@/components/admin/ArticleEditorForm";

export const metadata: Metadata = { title: "Новая статья — Управление Астерия" };

export default function NewArticlePage() {
  return <ArticleEditorForm />;
}
