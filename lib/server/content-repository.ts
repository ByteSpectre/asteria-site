import { notFound } from "next/navigation";
import { parseCategoryList } from "@/lib/category-list";
import { getDb } from "@/lib/server/db";

export async function listAdminArticles() {
  return getDb().article.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function listArticleCategories() {
  try {
    const rows = await getDb().articleCategory.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    });

    return Array.from(
      new Set(rows.flatMap((row) => parseCategoryList(row.name))),
    ).sort((a, b) => a.localeCompare(b, "ru"));
  } catch {
    // Fallback for environments where migration is not applied yet.
    const legacyRows = await getDb().article.findMany({ select: { category: true } });

    return Array.from(
      new Set(legacyRows.flatMap((row) => parseCategoryList(row.category))),
    ).sort((a, b) => a.localeCompare(b, "ru"));
  }
}

export async function listPublishedArticles() {
  return getDb().article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });
}

export async function getArticleForAdmin(id: string) {
  const article = await getDb().article.findUnique({ where: { id } });
  if (!article) notFound();
  return article;
}

export async function getPublishedArticle(slug: string) {
  const article = await getDb().article.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
  if (!article) notFound();
  return article;
}

export async function listAdminServices() {
  return getDb().service.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
}

export async function listPublishedServices() {
  return getDb().service.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
  });
}

export async function getServiceForAdmin(id: string) {
  const service = await getDb().service.findUnique({ where: { id } });
  if (!service) notFound();
  return service;
}

export async function getPublishedService(slug: string) {
  const service = await getDb().service.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
  if (!service) notFound();
  return service;
}
