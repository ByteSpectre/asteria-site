import { getDb } from "@/lib/server/db";
import { getClientFingerprint } from "@/lib/server/client-ip";

export async function consumeRateLimit(options: {
  scope: string;
  max: number;
  windowMs: number;
  /** Extra material mixed into the client key (e.g. admin login). */
  extra?: string;
}) {
  const fingerprint = await getClientFingerprint(options.extra ?? "");
  const key = `${options.scope}:${fingerprint}`;
  const now = Date.now();
  const resetAt = new Date(now + options.windowMs);
  const db = getDb();

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
    return { allowed: true as const, remaining: options.max - 1 };
  }

  if (entry.count > options.max) {
    return {
      allowed: false as const,
      retryAfter: entry.resetAt,
      remaining: 0,
    };
  }

  return {
    allowed: true as const,
    remaining: Math.max(0, options.max - entry.count),
  };
}
