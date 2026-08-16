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
  const db = getDb();

  const existing = await db.rateLimit.findUnique({ where: { key } });

  if (!existing || existing.resetAt.getTime() <= now) {
    const resetAt = new Date(now + options.windowMs);
    await db.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, resetAt },
      update: { count: 1, resetAt },
    });
    return { allowed: true as const, remaining: options.max - 1 };
  }

  if (existing.count >= options.max) {
    return {
      allowed: false as const,
      retryAfter: existing.resetAt,
      remaining: 0,
    };
  }

  const updated = await db.rateLimit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });

  return {
    allowed: true as const,
    remaining: Math.max(0, options.max - updated.count),
  };
}
