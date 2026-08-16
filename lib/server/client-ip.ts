import { createHash } from "node:crypto";
import { headers } from "next/headers";

/**
 * Resolve client IP without trusting a raw client-supplied X-Forwarded-For
 * leftmost hop on self-hosted setups. Prefer platform headers (Vercel/CF).
 */
export async function getClientIp() {
  const requestHeaders = await headers();
  return resolveClientIp(requestHeaders);
}

export function resolveClientIp(requestHeaders: Headers) {
  const vercel = requestHeaders.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercel) return vercel.slice(0, 128);

  const cloudflare = requestHeaders.get("cf-connecting-ip")?.trim();
  if (cloudflare) return cloudflare.slice(0, 128);

  const trustProxy =
    process.env.VERCEL === "1" ||
    process.env.TRUST_PROXY === "true" ||
    process.env.TRUST_PROXY === "1";

  if (trustProxy) {
    const realIp = requestHeaders.get("x-real-ip")?.trim();
    if (realIp) return realIp.slice(0, 128);

    const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (forwarded) return forwarded.slice(0, 128);
  }

  return "unknown";
}

export async function getClientFingerprint(extra = "") {
  const requestHeaders = await headers();
  const ip = resolveClientIp(requestHeaders);
  const ua = requestHeaders.get("user-agent")?.slice(0, 160) ?? "";
  return createHash("sha256").update(`${ip}|${ua}|${extra}`).digest("hex");
}
