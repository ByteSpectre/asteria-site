import { NextResponse } from "next/server";
import { createAdminSession, ensureAdminBootstrap, verifyAdminCredentials, verifyCaptcha } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";

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
    });
  }

  await ensureAdminBootstrap();
  const adminCount = await getDb().adminUser.count();
  if (adminCount === 0) {
    return NextResponse.json({
      ok: false,
      step: "env",
      hint: "no admin users in DB and no env bootstrap credentials",
    });
  }

  const user = await verifyAdminCredentials(login, password);
  if (!user) {
    return NextResponse.json({ ok: false, step: "credentials" });
  }

  await createAdminSession(user);
  return NextResponse.json({ ok: true, step: "done" });
}
