"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import type { Prisma } from "@/app/generated/prisma/client";
import { parseArticleInput, parseServiceInput, type ArticleInput, type ServiceInput } from "@/lib/content-validation";
import { joinCategoryList, parseCategoryList } from "@/lib/category-list";
import { slugify } from "@/lib/content";
import { createAdminSession, destroyAdminSession, ensureAdminBootstrap, requireAdmin, verifyAdminCredentials, verifyCaptcha } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { canAttemptLogin, clearLoginFailures, recordLoginFailure } from "@/lib/server/login-throttle";
import { z } from "zod";

const contentIdSchema = z.string().cuid();

export type LoginState = {
  error?: string;
  refresh: number;
};

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const login = String(formData.get("login") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const captcha = String(formData.get("captcha") ?? "");
  const attempt = await canAttemptLogin(login);

  if (!attempt.allowed) {
    return { error: "Слишком много попыток. Повторите вход через 15 минут.", refresh: Date.now() };
  }

  if (!(await verifyCaptcha(captcha))) {
    const locked = await recordLoginFailure(attempt.key, attempt.accountKey);
    if (locked) {
      return { error: "Слишком много попыток. Повторите вход через 15 минут.", refresh: Date.now() };
    }
    const localHttp = (process.env.SITE_URL ?? "").startsWith("http://");
    return {
      error: localHttp
        ? "Неверный код с изображения (или cookie капчи не сохранилась). Обновите код и попробуйте снова."
        : "Неверный ввод. Проверьте данные и код с изображения.",
      refresh: Date.now(),
    };
  }

  await ensureAdminBootstrap();
  const user = await verifyAdminCredentials(login, password);
  if (!user) {
    const locked = await recordLoginFailure(attempt.key, attempt.accountKey);
    if (locked) {
      return { error: "Слишком много попыток. Повторите вход через 15 минут.", refresh: Date.now() };
    }
    const localHttp = (process.env.SITE_URL ?? "").startsWith("http://");
    return {
      error: localHttp
        ? "Неверный логин или пароль."
        : "Неверный ввод. Проверьте данные и код с изображения.",
      refresh: Date.now(),
    };
  }

  await clearLoginFailures(attempt.key, attempt.accountKey);
  await createAdminSession(user);
  redirect("/admin/knowledge");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

async function uniqueArticleSlug(title: string, id?: string) {
  const db = getDb();
  const base = slugify(title);
  let slug = base;
  let suffix = 2;
  while (await db.article.findFirst({ where: { slug, ...(id ? { id: { not: id } } : {}) }, select: { id: true } })) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

async function uniqueServiceSlug(title: string, id?: string) {
  const db = getDb();
  const base = slugify(title);
  let slug = base;
  let suffix = 2;
  while (await db.service.findFirst({ where: { slug, ...(id ? { id: { not: id } } : {}) }, select: { id: true } })) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

export async function saveArticleAction(input: ArticleInput) {
  await requireAdmin();
  const data = parseArticleInput(input);
  const db = getDb();
  const categories = parseCategoryList(data.category);
  const categoryValue = joinCategoryList(categories);
  const slug = await uniqueArticleSlug(data.title, data.id);
  const existing = data.id ? await db.article.findUnique({ where: { id: data.id }, select: { publishedAt: true } }) : null;
  const publishedAt = data.published ? existing?.publishedAt ?? new Date() : null;

  const values = {
    title: data.title,
    category: categoryValue,
    excerpt: data.excerpt || null,
    previewImage: data.previewImage || null,
    slug,
    content: data.content as Prisma.InputJsonValue,
    status: data.published ? ("PUBLISHED" as const) : ("DRAFT" as const),
    publishedAt,
  };

  if (data.id) {
    await db.article.update({ where: { id: data.id }, data: values });
  } else {
    await db.article.create({ data: values });
  }

  try {
    for (const categoryName of categories) {
      await db.articleCategory.upsert({
        where: { name: categoryName },
        create: { name: categoryName },
        update: {},
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (!message.includes("articlecategory")) {
      throw error;
    }
  }

  revalidatePath("/admin/knowledge");
  revalidatePath("/knowledge");
  redirect("/admin/knowledge");
}

export async function deleteArticleAction(id: string) {
  await requireAdmin();
  await getDb().article.delete({ where: { id: contentIdSchema.parse(id) } });
  revalidatePath("/admin/knowledge");
  revalidatePath("/knowledge");
}

export async function saveServiceAction(input: ServiceInput) {
  await requireAdmin();
  const data = parseServiceInput(input);
  const db = getDb();
  const slug = await uniqueServiceSlug(data.title, data.id);
  const existing = data.id ? await db.service.findUnique({ where: { id: data.id }, select: { publishedAt: true } }) : null;

  const values = {
    title: data.title,
    category: data.category,
    summary: data.summary || null,
    pricing: data.pricing as Prisma.InputJsonValue,
    scopeItems: data.scopeItems as Prisma.InputJsonValue,
    faqItems: data.faqItems as Prisma.InputJsonValue,
    cases: data.cases as Prisma.InputJsonValue,
    slug,
    status: data.published ? ("PUBLISHED" as const) : ("DRAFT" as const),
    publishedAt: data.published ? existing?.publishedAt ?? new Date() : null,
  };

  if (data.id) {
    await db.service.update({ where: { id: data.id }, data: values });
  } else {
    await db.service.create({ data: values });
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath(`/services/${slug}`);
  revalidateTag("service-nav", "max");
  redirect("/admin/services");
}

export async function deleteServiceAction(id: string) {
  await requireAdmin();
  const service = await getDb().service.findUnique({
    where: { id: contentIdSchema.parse(id) },
    select: { slug: true },
  });
  await getDb().service.delete({ where: { id: contentIdSchema.parse(id) } });
  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/services");
  if (service?.slug) {
    revalidatePath(`/services/${service.slug}`);
  }
  revalidateTag("service-nav", "max");
}
