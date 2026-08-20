import { createHash } from "node:crypto";
import { getClientFingerprint } from "@/lib/server/client-ip";
import { getDb } from "@/lib/server/db";

const MAX_FAILURES = 5;
const ACCOUNT_MAX_FAILURES = 20;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const FAILURE_WINDOW_MS = 15 * 60 * 1000;

function hashAccount(login: string) {
  return createHash("sha256").update(login.trim().toLowerCase()).digest("hex");
}

async function getThrottleKeys(login: string) {
  const fingerprint = await getClientFingerprint("login");
  const account = hashAccount(login);
  return {
    key: `${fingerprint}:${account}`,
    accountKey: `account:${account}`,
  };
}

function isLocked(entry: { lockedUntil: Date | null; updatedAt: Date } | null) {
  return Boolean(entry?.lockedUntil && entry.lockedUntil.getTime() > Date.now());
}

async function sweepStale(key: string, entry: { lockedUntil: Date | null; updatedAt: Date }) {
  if (entry.lockedUntil || entry.updatedAt.getTime() < Date.now() - FAILURE_WINDOW_MS) {
    await getDb().loginThrottle.delete({ where: { key } }).catch(() => undefined);
  }
}

export async function canAttemptLogin(login: string) {
  const { key, accountKey } = await getThrottleKeys(login);
  const db = getDb();

  const [entry, accountEntry] = await Promise.all([
    db.loginThrottle.findUnique({ where: { key } }),
    db.loginThrottle.findUnique({ where: { key: accountKey } }),
  ]);

  if (entry && !isLocked(entry)) await sweepStale(key, entry);
  if (accountEntry && !isLocked(accountEntry)) await sweepStale(accountKey, accountEntry);

  const lockedUntil = [entry?.lockedUntil, accountEntry?.lockedUntil]
    .filter((value): value is Date => Boolean(value && value.getTime() > Date.now()))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  if (lockedUntil) {
    return { allowed: false as const, key, accountKey, retryAfter: lockedUntil };
  }
  return { allowed: true as const, key, accountKey };
}

// Atomic increment + lock to reduce TOCTOU races under concurrent attempts.
async function recordFailure(key: string, maxFailures: number) {
  const lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);

  await getDb().$executeRaw`
    INSERT INTO "LoginThrottle" ("key", "failures", "lockedUntil", "updatedAt")
    VALUES (${key}, 1, NULL, NOW())
    ON CONFLICT ("key") DO UPDATE SET
      "failures" = "LoginThrottle"."failures" + 1,
      "lockedUntil" = CASE
        WHEN "LoginThrottle"."failures" + 1 >= ${maxFailures}
          THEN ${lockedUntil}
        ELSE "LoginThrottle"."lockedUntil"
      END,
      "updatedAt" = NOW()
  `;

  const entry = await getDb().loginThrottle.findUnique({ where: { key } });
  return isLocked(entry);
}

export async function recordLoginFailure(key: string, accountKey: string) {
  // Two counters: per IP+account (strict) and per account across all IPs
  // (stops distributed brute force against the single admin account).
  const [locked, accountLocked] = await Promise.all([
    recordFailure(key, MAX_FAILURES),
    recordFailure(accountKey, ACCOUNT_MAX_FAILURES),
  ]);
  return locked || accountLocked;
}

export async function clearLoginFailures(key: string, accountKey: string) {
  await getDb().loginThrottle.deleteMany({ where: { key: { in: [key, accountKey] } } });
}
