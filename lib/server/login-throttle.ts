import { getClientFingerprint } from "@/lib/server/client-ip";
import { getDb } from "@/lib/server/db";

const MAX_FAILURES = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const FAILURE_WINDOW_MS = 15 * 60 * 1000;

async function getThrottleKey() {
  return getClientFingerprint("login");
}

export async function canAttemptLogin() {
  const key = await getThrottleKey();
  const entry = await getDb().loginThrottle.findUnique({ where: { key } });
  if (!entry) return { allowed: true, key } as const;

  if (entry.lockedUntil && entry.lockedUntil.getTime() > Date.now()) {
    return { allowed: false, key, retryAfter: entry.lockedUntil } as const;
  }

  if (entry.lockedUntil || entry.updatedAt.getTime() < Date.now() - FAILURE_WINDOW_MS) {
    await getDb().loginThrottle.delete({ where: { key } }).catch(() => undefined);
  }

  return { allowed: true, key } as const;
}

export async function recordLoginFailure(key: string) {
  const lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);

  // Atomic increment + lock to reduce TOCTOU races under concurrent attempts.
  await getDb().$executeRaw`
    INSERT INTO "LoginThrottle" ("key", "failures", "lockedUntil", "updatedAt")
    VALUES (${key}, 1, NULL, NOW())
    ON CONFLICT ("key") DO UPDATE SET
      "failures" = "LoginThrottle"."failures" + 1,
      "lockedUntil" = CASE
        WHEN "LoginThrottle"."failures" + 1 >= ${MAX_FAILURES}
          THEN ${lockedUntil}
        ELSE "LoginThrottle"."lockedUntil"
      END,
      "updatedAt" = NOW()
  `;

  const entry = await getDb().loginThrottle.findUnique({ where: { key } });
  return Boolean(entry?.lockedUntil && entry.lockedUntil.getTime() > Date.now());
}

export async function clearLoginFailures(key: string) {
  await getDb().loginThrottle.deleteMany({ where: { key } });
}
