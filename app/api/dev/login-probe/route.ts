import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminPasswordHash } from "@/lib/server/admin-credentials";
import { createAdminSession, verifyCaptcha } from "@/lib/server/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isLocalHttpSite() {
  const siteUrl = process.env.SITE_URL?.trim() ?? "";
  return (
    siteUrl.startsWith("http://127.0.0.1") ||
    siteUrl.startsWith("http://localhost")
  );
}

/**
 * Local-only login probe for WSL/http. Disabled when SITE_URL is https.
 * POST JSON: { login, password, captcha }
 */
export async function POST(request: Request) {
  if (!isLocalHttpSite()) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  let body: { login?: string; password?: string; captcha?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const login = String(body.login ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const captcha = String(body.captcha ?? "");

  const captchaOk = await verifyCaptcha(captcha);
  if (!captchaOk) {
    return NextResponse.json({
      ok: false,
      step: "captcha",
      siteUrl: process.env.SITE_URL,
      nodeEnv: process.env.NODE_ENV,
      hasAuthSecret: Boolean(process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32),
      hasHash: Boolean(getAdminPasswordHash()),
    });
  }

  const expectedLogin = process.env.ADMIN_LOGIN?.trim().toLowerCase();
  const passwordHash = getAdminPasswordHash();
  if (!expectedLogin || !passwordHash) {
    return NextResponse.json({
      ok: false,
      step: "env",
      rawHashLen: process.env.ADMIN_PASSWORD_HASH?.length ?? 0,
      hasB64: Boolean(process.env.ADMIN_PASSWORD_HASH_B64?.trim()),
    });
  }

  const validPassword = await bcrypt.compare(password, passwordHash);
  if (login !== expectedLogin || !validPassword) {
    return NextResponse.json({
      ok: false,
      step: "credentials",
      loginMatch: login === expectedLogin,
      passwordMatch: validPassword,
      hashLen: passwordHash.length,
      hashPrefix: passwordHash.slice(0, 7),
      hashDollars: (passwordHash.match(/\$/g) ?? []).length,
      passwordLen: password.length,
    });
  }

  await createAdminSession(expectedLogin);
  return NextResponse.json({ ok: true, step: "done" });
}
