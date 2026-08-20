import { createHash } from "node:crypto";
import { headers } from "next/headers";

/**
 * Resolve client IP. Platform/proxy headers are honored only on the platform
 * that sets (and overwrites) them — otherwise any client can spoof them.
 */
export async function getClientIp() {
  const requestHeaders = await headers();
  return resolveClientIp(requestHeaders);
}

export function resolveClientIp(requestHeaders: Headers) {
  // x-vercel-forwarded-for is set by the Vercel edge and cannot be spoofed there.
  if (process.env.VERCEL === "1" || process.env.VERCEL === "true") {
    const vercel = requestHeaders.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
    if (vercel) return vercel.slice(0, 128);
  }

  // cf-connecting-ip is trustworthy only when traffic actually passes through
  // Cloudflare and the operator opted in via TRUST_CLOUDFLARE.
  if (process.env.TRUST_CLOUDFLARE === "true" || process.env.TRUST_CLOUDFLARE === "1") {
    const cloudflare = requestHeaders.get("cf-connecting-ip")?.trim();
    if (cloudflare) return cloudflare.slice(0, 128);
  }

  const trustProxy =
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
  // User-Agent is deliberately excluded: it is fully client-controlled, so
  // mixing it into the key would let an attacker mint a fresh throttle bucket
  // per request just by rotating the header.
  return createHash("sha256").update(`${ip}|${extra}`).digest("hex");
}
