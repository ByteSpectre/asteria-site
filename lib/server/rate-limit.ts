import { getDb } from "@/lib/server/db";
import { getClientFingerprint } from "@/lib/server/client-ip";

async function consume(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const resetAt = new Date(now + windowMs);
  const db = getDb();

  try {
    // Single round-trip upsert to cut captcha/contact latency on serverless.
    const rows = await db.$queryRaw<Array<{ count: number; resetAt: Date }>>`
      INSERT INTO "RateLimit" ("key", "count", "resetAt", "updatedAt")
      VALUES (${key}, 1, ${resetAt}, NOW())
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE
          WHEN "RateLimit"."resetAt" <= NOW() THEN 1
          ELSE "RateLimit"."count" + 1
        END,
        "resetAt" = CASE
          WHEN "RateLimit"."resetAt" <= NOW() THEN ${resetAt}
          ELSE "RateLimit"."resetAt"
        END,
        "updatedAt" = NOW()
      RETURNING "count", "resetAt"
    `;

    const entry = rows[0];
    if (!entry) {
      return { allowed: true as const, remaining: max - 1 };
    }

    if (entry.count > max) {
      return {
        allowed: false as const,
        retryAfter: entry.resetAt,
        remaining: 0,
      };
    }

    return {
      allowed: true as const,
      remaining: Math.max(0, max - entry.count),
    };
  } catch (error) {
    // Dev / not-yet-migrated DB: don't break captcha/contact forms.
    console.error(
      "[rate-limit] unavailable",
      error instanceof Error ? error.message : "unknown",
    );
    return { allowed: true as const, remaining: max };
  }
}

export async function consumeRateLimit(options: {
  scope: string;
  max: number;
  windowMs: number;
  /** Extra material mixed into the client key (e.g. admin login). */
  extra?: string;
}) {
  const fingerprint = await getClientFingerprint(options.extra ?? "");
  return consume(`${options.scope}:${fingerprint}`, options.max, options.windowMs);
}

/**
 * Site-wide cap not derived from any client-controlled material — a fallback
 * ceiling that holds even if per-client keys are rotated or spoofed.
 */
export async function consumeGlobalRateLimit(options: {
  scope: string;
  max: number;
  windowMs: number;
}) {
  return consume(`${options.scope}:global`, options.max, options.windowMs);
}
