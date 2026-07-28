import { notFound } from "next/navigation";
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

    return rows
      .map((row) => row.name.trim())
      .filter((category) => category.length > 0);
  } catch {
    // Fallback for environments where migration is not applied yet.
    const legacyRows = await getDb().article.findMany({
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    });

    return legacyRows
      .map((row) => row.category.trim())
      .filter((category) => category.length > 0);
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
