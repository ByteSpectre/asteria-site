import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ContentTable } from "@/components/admin/ContentTable";
import { formatContentDate } from "@/lib/content";
import { listAdminArticles } from "@/lib/server/content-repository";

export const metadata: Metadata = { title: "База знаний — Управление Астерия" };

export default async function AdminKnowledgePage() {
  const articles = await listAdminArticles();
  const rows = articles.map((article) => ({
    id: article.id,
    title: article.title,
    category: article.category,
    date: formatContentDate(article.updatedAt),
    status: article.status,
    editHref: `/admin/knowledge/${article.id}/edit`,
    publicHref: `/knowledge/${article.slug}`,
  }));

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-7 lg:px-10 lg:py-12">
      <AdminPageHeader eyebrow="Редактор материалов" title="База знаний" description="Создавайте, редактируйте и публикуйте юридические статьи для посетителей сайта." publicHref="/knowledge" />
      <ContentTable kind="article" rows={rows} addHref="/admin/knowledge/new" emptyTitle="Статей пока нет" />
    </div>
  );
}
