"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { destroyAdminSession, requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";

export type AdminFormState = {
  ok?: boolean;
  error?: string;
  refresh: number;
};

const loginSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Логин должен содержать минимум 3 символа.")
  .max(64, "Логин должен содержать максимум 64 символа.")
  .regex(/^[a-z0-9@._+-]+$/, "Только латиница, цифры и символы @ . _ + -");

const passwordSchema = z
  .string()
  .min(8, "Пароль должен содержать минимум 8 символов.")
  .max(72, "Пароль должен содержать максимум 72 символа.");

const adminIdSchema = z.string().cuid();

function fail(error: string): AdminFormState {
  return { error, refresh: Date.now() };
}

export async function createAdminAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const login = loginSchema.safeParse(String(formData.get("login") ?? ""));
  if (!login.success) return fail(login.error.issues[0]?.message ?? "Проверьте логин.");

  const password = passwordSchema.safeParse(String(formData.get("password") ?? ""));
  if (!password.success) return fail(password.error.issues[0]?.message ?? "Проверьте пароль.");

  const db = getDb();
  const existing = await db.adminUser.findUnique({ where: { login: login.data } });
  if (existing) return fail("Администратор с таким логином уже существует.");

  await db.adminUser.create({
    data: { login: login.data, passwordHash: await bcrypt.hash(password.data, 12) },
  });

  revalidatePath("/admin/admins");
  return { ok: true, refresh: Date.now() };
}

export async function updateAdminAction(
  adminId: string,
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const session = await requireAdmin();
  const id = adminIdSchema.safeParse(adminId);
  if (!id.success) return fail("Некорректный идентификатор.");

  const login = loginSchema.safeParse(String(formData.get("login") ?? ""));
  if (!login.success) return fail(login.error.issues[0]?.message ?? "Проверьте логин.");

  const rawPassword = String(formData.get("password") ?? "");
  const password = rawPassword.length > 0 ? passwordSchema.safeParse(rawPassword) : null;
  const newPassword = password && password.success ? password.data : null;
  if (password && !password.success) {
    return fail(password.error.issues[0]?.message ?? "Проверьте пароль.");
  }

  const db = getDb();
  const target = await db.adminUser.findUnique({ where: { id: id.data } });
  if (!target) return fail("Администратор не найден.");

  const loginChanged = login.data !== target.login;
  const passwordChanged = newPassword !== null;
  if (!loginChanged && !passwordChanged) return fail("Нет изменений для сохранения.");

  if (loginChanged) {
    const taken = await db.adminUser.findUnique({ where: { login: login.data } });
    if (taken) return fail("Администратор с таким логином уже существует.");
  }

  // Bumping tokenVersion invalidates every active session of this admin,
  // so a credential change forces a fresh login everywhere.
  await db.adminUser.update({
    where: { id: target.id },
    data: {
      ...(loginChanged ? { login: login.data } : {}),
      ...(newPassword !== null ? { passwordHash: await bcrypt.hash(newPassword, 12) } : {}),
      tokenVersion: { increment: 1 },
    },
  });

  if (target.id === session.id) {
    await destroyAdminSession();
    redirect("/admin/login");
  }

  revalidatePath("/admin/admins");
  return { ok: true, refresh: Date.now() };
}

export async function deleteAdminAction(
  adminId: string,
  _prev: AdminFormState,
  _formData: FormData,
): Promise<AdminFormState> {
  const session = await requireAdmin();
  const id = adminIdSchema.safeParse(adminId);
  if (!id.success) return fail("Некорректный идентификатор.");

  if (id.data === session.id) {
    return fail("Нельзя удалить собственную учётную запись.");
  }

  const db = getDb();
  const total = await db.adminUser.count();
  if (total <= 1) return fail("Нельзя удалить последнего администратора.");

  await db.adminUser.delete({ where: { id: id.data } });
  revalidatePath("/admin/admins");
  return { ok: true, refresh: Date.now() };
}
