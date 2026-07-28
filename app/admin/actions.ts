"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@/app/generated/prisma/client";
import { parseArticleInput, parseServiceInput, type ArticleInput, type ServiceInput } from "@/lib/content-validation";
import { slugify } from "@/lib/content";
import { createAdminSession, destroyAdminSession, requireAdmin, verifyCaptcha } from "@/lib/server/auth";
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
  const attempt = await canAttemptLogin();

  if (!attempt.allowed) {
    return { error: "Слишком много попыток. Повторите вход через 15 минут.", refresh: Date.now() };
  }

  if (!(await verifyCaptcha(captcha))) {
    const locked = await recordLoginFailure(attempt.key);
    if (locked) {
      return { error: "Слишком много попыток. Повторите вход через 15 минут.", refresh: Date.now() };
    }
    return { error: "Код с изображения введён неверно или устарел.", refresh: Date.now() };
  }

  const expectedLogin = process.env.ADMIN_LOGIN?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedLogin || !passwordHash) {
    return { error: "Учётная запись администратора не настроена.", refresh: Date.now() };
  }

  const validPassword = await bcrypt.compare(password, passwordHash);
  if (login !== expectedLogin || !validPassword) {
    const locked = await recordLoginFailure(attempt.key);
    if (locked) {
      return { error: "Слишком много попыток. Повторите вход через 15 минут.", refresh: Date.now() };
    }
    return { error: "Неверный логин или пароль.", refresh: Date.now() };
  }

  await clearLoginFailures(attempt.key);
  await createAdminSession(expectedLogin);
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
  const categoryName = data.category.trim();
  const slug = await uniqueArticleSlug(data.title, data.id);
  const existing = data.id ? await db.article.findUnique({ where: { id: data.id }, select: { publishedAt: true } }) : null;
  const publishedAt = data.published ? existing?.publishedAt ?? new Date() : null;

  const values = {
    title: data.title,
    category: categoryName,
    excerpt: data.excerpt || null,
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

  await db.articleCategory.upsert({
    where: { name: categoryName },
    create: { name: categoryName },
    update: {},
  });

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
  revalidatePath("/services");
  redirect("/admin/services");
}

export async function deleteServiceAction(id: string) {
  await requireAdmin();
  await getDb().service.delete({ where: { id: contentIdSchema.parse(id) } });
  revalidatePath("/admin/services");
  revalidatePath("/services");
}
