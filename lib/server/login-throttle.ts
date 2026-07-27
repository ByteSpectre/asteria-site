import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getDb } from "@/lib/server/db";

const MAX_FAILURES = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const FAILURE_WINDOW_MS = 15 * 60 * 1000;

async function getThrottleKey() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientAddress = forwardedFor || requestHeaders.get("x-real-ip")?.trim() || "unknown";
  return createHash("sha256")
    .update(clientAddress.slice(0, 128))
    .digest("hex");
}

export async function canAttemptLogin() {
  const key = await getThrottleKey();
  const entry = await getDb().loginThrottle.findUnique({ where: { key } });
  if (!entry) return { allowed: true, key } as const;

  if (entry.lockedUntil && entry.lockedUntil.getTime() > Date.now()) {
    return { allowed: false, key, retryAfter: entry.lockedUntil } as const;
  }

  if (entry.lockedUntil || entry.updatedAt.getTime() < Date.now() - FAILURE_WINDOW_MS) {
    await getDb().loginThrottle.delete({ where: { key } });
  }

  return { allowed: true, key } as const;
}

export async function recordLoginFailure(key: string) {
  const entry = await getDb().loginThrottle.upsert({
    where: { key },
    create: { key, failures: 1 },
    update: { failures: { increment: 1 } },
  });

  if (entry.failures < MAX_FAILURES) return false;

  await getDb().loginThrottle.update({
    where: { key },
    data: { lockedUntil: new Date(Date.now() + LOCK_DURATION_MS) },
  });
  return true;
}

export async function clearLoginFailures(key: string) {
  await getDb().loginThrottle.deleteMany({ where: { key } });
}
