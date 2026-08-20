import { NextResponse } from "next/server";
import { resolveAdminCaptchaCode } from "@/lib/server/auth";
import { renderCaptchaSvg } from "@/lib/server/captcha-image";
import { consumeRateLimit } from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const limit = await consumeRateLimit({
    scope: "admin-captcha",
    max: 30,
    windowMs: 60 * 1000,
  });
  if (!limit.allowed) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const fresh = new URL(request.url).searchParams.has("fresh");
  const code = await resolveAdminCaptchaCode(fresh);

  const svg = renderCaptchaSvg(code, {
    background: "#f5f1e8",
    ink: "#2c1119",
    noise: "#431c26",
  });

  const response = new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });

  // Local HTTP only: expose answer for WSL/e2e debugging (never on https SITE_URL).
  const siteUrl = process.env.SITE_URL?.trim() ?? "";
  if (siteUrl.startsWith("http://127.0.0.1") || siteUrl.startsWith("http://localhost")) {
    response.headers.set("X-Debug-Captcha", code);
  }

  return response;
}
