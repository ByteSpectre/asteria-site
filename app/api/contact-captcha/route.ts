import { NextResponse } from "next/server";
import { renderCaptchaSvg } from "@/lib/server/captcha-image";
import { resolveContactCaptchaCode } from "@/lib/server/contact-security";
import { consumeRateLimit } from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const limit = await consumeRateLimit({
    scope: "contact-captcha",
    max: 30,
    windowMs: 60 * 1000,
  });
  if (!limit.allowed) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const fresh = new URL(request.url).searchParams.has("fresh");
  const code = await resolveContactCaptchaCode(fresh);

  const svg = renderCaptchaSvg(code, {
    background: "#fbf8f1",
    ink: "#2c1119",
    noise: "#431c26",
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
