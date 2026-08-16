import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { fileTypeFromBuffer } from "file-type";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/server/auth";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import {
  EDITOR_UPLOAD_TYPES,
  getUploadDirectory,
  isTrustedUploadOrigin,
  MAX_ADMIN_UPLOADS_PER_DAY,
  MAX_EDITOR_UPLOAD_BYTES,
} from "@/lib/server/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isTrustedUploadOrigin(request.headers.get("origin"))) {
    return NextResponse.json({ error: "Недоверенный источник запроса" }, { status: 403 });
  }

  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Требуется вход в панель управления" }, { status: 401 });
  }

  const quota = await consumeRateLimit({
    scope: "admin-upload",
    max: MAX_ADMIN_UPLOADS_PER_DAY,
    windowMs: 24 * 60 * 60 * 1000,
    extra: session.login,
  });
  if (!quota.allowed) {
    return NextResponse.json(
      { error: "Превышен дневной лимит загрузок. Повторите завтра." },
      { status: 429 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
  }

  const extension = EDITOR_UPLOAD_TYPES.get(file.type);
  if (!extension) {
    return NextResponse.json({ error: "Этот формат файла не поддерживается" }, { status: 415 });
  }

  if (file.size === 0 || file.size > MAX_EDITOR_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Размер файла должен быть от 1 байта до 4 МБ" }, { status: 413 });
  }

  const content = Buffer.from(await file.arrayBuffer());
  const detectedType = await fileTypeFromBuffer(content);
  if (!detectedType || detectedType.mime !== file.type) {
    return NextResponse.json(
      { error: "Содержимое файла не соответствует заявленному формату" },
      { status: 415 },
    );
  }

  const fileName = `${randomUUID()}${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`editor/${fileName}`, content, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url }, { status: 201 });
  }

  if (process.env.VERCEL) {
    return NextResponse.json({ error: "Хранилище файлов не настроено" }, { status: 503 });
  }

  const uploadDirectory = getUploadDirectory();
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, fileName), content, { flag: "wx" });

  return NextResponse.json({ url: `/api/uploads/${fileName}` }, { status: 201 });
}
