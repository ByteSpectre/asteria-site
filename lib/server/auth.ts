import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createCipheriv, createDecipheriv, createHash, hkdfSync, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { EncryptJWT, jwtDecrypt, jwtVerify, SignJWT } from "jose";
import { getAdminPasswordHash } from "@/lib/server/admin-credentials";
import { createCaptchaCode } from "@/lib/server/captcha-image";
import { resolveClientIp } from "@/lib/server/client-ip";
import { getDb } from "@/lib/server/db";

const SESSION_COOKIE = "asteria_admin_session";
const CAPTCHA_COOKIE = "asteria_admin_captcha";
const TOKEN_ISSUER = "asteria-site";
const TOKEN_AUDIENCE = "asteria-admin";

type AdminSession = {
  id: string;
  login: string;
  role: "ADMIN";
};

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET должен содержать не менее 32 символов.");
  }
  return new TextEncoder().encode(secret);
}

/** Secure cookies on HTTPS (Vercel, VPS behind Nginx). HTTP only for local/WSL. */
export function secureCookies() {
  const siteUrl = process.env.SITE_URL?.trim() ?? "";
  if (siteUrl.startsWith("https://")) return true;
  if (siteUrl.startsWith("http://")) return false;
  if (process.env.VERCEL === "1" || process.env.VERCEL === "true") return true;
  return process.env.NODE_ENV === "production";
}

function getEncryptionKey() {
  return createHash("sha256").update(getSecretKey()).digest();
}

async function signToken(payload: Record<string, unknown>, expiresIn: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(TOKEN_ISSUER)
    .setAudience(TOKEN_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecretKey());
}

export async function createAdminSession(user: { id: string; login: string; tokenVersion: number }) {
  const token = await signToken(
    { sub: user.id, login: user.login, tv: user.tokenVersion, role: "ADMIN", kind: "session" },
    "8h",
  );
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookies(),
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    });
    if (
      payload.kind !== "session" ||
      payload.role !== "ADMIN" ||
      typeof payload.sub !== "string" ||
      typeof payload.tv !== "number"
    ) {
      return null;
    }
    // Session dies when credentials change: any login/password edit bumps
    // tokenVersion, invalidating every token issued before.
    const user = await getDb().adminUser.findUnique({
      where: { id: payload.sub },
      select: { id: true, login: true, tokenVersion: true },
    });
    if (!user || user.tokenVersion !== payload.tv) return null;
    return { id: user.id, login: user.login, role: "ADMIN" };
  } catch {
    return null;
  }
}

/**
 * First-run bootstrap: when the admins table is empty, seed it from
 * ADMIN_LOGIN + ADMIN_PASSWORD_HASH[_B64] env vars. Env credentials stop
 * working as soon as at least one admin exists in the database.
 */
export async function ensureAdminBootstrap() {
  const db = getDb();
  const count = await db.adminUser.count();
  if (count > 0) return;

  const login = process.env.ADMIN_LOGIN?.trim().toLowerCase();
  const passwordHash = getAdminPasswordHash();
  if (!login || !passwordHash) return;

  await db.adminUser
    .create({ data: { login, passwordHash } })
    .catch(() => undefined);
}

export async function verifyAdminCredentials(login: string, password: string) {
  const user = await getDb().adminUser.findUnique({
    where: { login: login.trim().toLowerCase() },
    select: { id: true, login: true, passwordHash: true, tokenVersion: true },
  });
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return { id: user.id, login: user.login, tokenVersion: user.tokenVersion };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

const CAPTCHA_TTL_MS = 5 * 60 * 1000;

export type CaptchaAudience = "admin" | "contact";

function hashCaptchaAnswer(answer: string) {
  return createHash("sha256").update(answer.trim().toUpperCase()).digest("hex");
}

// Captcha codes are stored encrypted so a challenge can be re-rendered
// identically when the browser fetches the image more than once.
function getCaptchaCipherKey() {
  return Buffer.from(hkdfSync("sha256", getSecretKey(), "asteria-admin-auth", "captcha-code-v1", 32));
}

function encryptCaptchaCode(code: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getCaptchaCipherKey(), iv);
  const encrypted = Buffer.concat([cipher.update(code, "utf8"), cipher.final()]);
  return `${iv.toString("base64")}.${encrypted.toString("base64")}.${cipher.getAuthTag().toString("base64")}`;
}

function decryptCaptchaCode(payload: string) {
  const [iv, encrypted, tag] = payload.split(".").map((part) => Buffer.from(part, "base64"));
  if (!iv || !encrypted || !tag) return null;
  try {
    const decipher = createDecipheriv("aes-256-gcm", getCaptchaCipherKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

async function setCaptchaCookie(options: {
  cookieName: string;
  challengeId: string;
  audience: CaptchaAudience;
  sameSite: "lax" | "strict";
}) {
  const token = await new EncryptJWT({
    kind: "captcha",
    challengeId: options.challengeId,
    captchaAudience: options.audience,
  })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuer(TOKEN_ISSUER)
    .setAudience(TOKEN_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("5m")
    .encrypt(getEncryptionKey());

  const store = await cookies();
  store.set(options.cookieName, token, {
    httpOnly: true,
    sameSite: options.sameSite,
    secure: secureCookies(),
    path: "/",
    maxAge: CAPTCHA_TTL_MS / 1000,
  });
}

/**
 * Captcha answers live only as server-side hashes. The cookie carries an
 * encrypted challenge id; the answer itself never leaves the server in any
 * reversible form, and every challenge is consumed atomically on first use.
 */
export async function issueCaptcha(options: {
  cookieName: string;
  answer: string;
  audience: CaptchaAudience;
  sameSite: "lax" | "strict";
  dedupeKey?: string;
}) {
  const db = getDb();
  const challenge = await db.captchaChallenge.create({
    data: {
      answerHash: hashCaptchaAnswer(options.answer),
      codeCipher: encryptCaptchaCode(options.answer),
      dedupeKey: options.dedupeKey,
      audience: options.audience,
      expiresAt: new Date(Date.now() + CAPTCHA_TTL_MS),
    },
    select: { id: true },
  });

  db.captchaChallenge
    .deleteMany({ where: { expiresAt: { lt: new Date() } } })
    .catch(() => undefined);

  await setCaptchaCookie({
    cookieName: options.cookieName,
    challengeId: challenge.id,
    audience: options.audience,
    sameSite: options.sameSite,
  });
}

export async function verifyCaptchaAnswer(options: {
  cookieName: string;
  answer: string;
  audience: CaptchaAudience;
}) {
  const store = await cookies();
  const token = store.get(options.cookieName)?.value;
  store.delete(options.cookieName);
  if (!token) return false;

  let challengeId: string;
  try {
    const { payload } = await jwtDecrypt(token, getEncryptionKey(), {
      keyManagementAlgorithms: ["dir"],
      contentEncryptionAlgorithms: ["A256GCM"],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    });
    if (
      payload.kind !== "captcha" ||
      payload.captchaAudience !== options.audience ||
      typeof payload.challengeId !== "string"
    ) {
      return false;
    }
    challengeId = payload.challengeId;
  } catch {
    return false;
  }

  const db = getDb();
  const challenge = await db.captchaChallenge.findUnique({ where: { id: challengeId } });
  if (
    !challenge ||
    challenge.audience !== options.audience ||
    challenge.expiresAt.getTime() <= Date.now()
  ) {
    return false;
  }

  // Single-use: whoever deletes the row first wins; replays find nothing.
  const { count } = await db.captchaChallenge.deleteMany({ where: { id: challengeId } });
  if (count !== 1) return false;

  return challenge.answerHash === hashCaptchaAnswer(options.answer);
}

/**
 * Resolve which code to render for a captcha image request. Browsers (and
 * React dev double-mounting) may fetch the same image URL more than once;
 * reusing the existing unconsumed challenge keeps the visible image and the
 * cookie in sync. Pass `fresh: true` for the explicit "new code" button.
 */
export async function resolveCaptchaCode(options: {
  cookieName: string;
  audience: CaptchaAudience;
  sameSite: "lax" | "strict";
  fresh: boolean;
}) {
  const db = getDb();

  if (!options.fresh) {
    const store = await cookies();
    const token = store.get(options.cookieName)?.value;
    if (token) {
      try {
        const { payload } = await jwtDecrypt(token, getEncryptionKey(), {
          keyManagementAlgorithms: ["dir"],
          contentEncryptionAlgorithms: ["A256GCM"],
          issuer: TOKEN_ISSUER,
          audience: TOKEN_AUDIENCE,
        });
        const challengeId =
          payload.kind === "captcha" &&
          payload.captchaAudience === options.audience &&
          typeof payload.challengeId === "string"
            ? payload.challengeId
            : null;
        if (challengeId) {
          const challenge = await db.captchaChallenge.findFirst({
            where: { id: challengeId, audience: options.audience, expiresAt: { gt: new Date() } },
            select: { codeCipher: true },
          });
          const code = challenge?.codeCipher ? decryptCaptchaCode(challenge.codeCipher) : null;
          if (code) return code;
        }
      } catch {
        // fall through and issue a fresh challenge
      }
    }
  }

  // Single-flight: browsers may fire the image request twice in parallel
  // (React dev remounts, hydration recovery). Both requests then share one
  // challenge per (audience, IP, 3s bucket), so the visible image and the
  // cookie can never diverge regardless of response order.
  const requestHeaders = await headers();
  const ip = resolveClientIp(requestHeaders);
  const bucket = Math.floor(Date.now() / 3000);
  const dedupeKey = createHash("sha256")
    .update(`captcha|${options.audience}|${ip}|${bucket}`)
    .digest("hex");

  const existing = await db.captchaChallenge.findUnique({
    where: { dedupeKey },
    select: { id: true, codeCipher: true, expiresAt: true },
  });
  if (existing && existing.expiresAt.getTime() > Date.now()) {
    const code = existing.codeCipher ? decryptCaptchaCode(existing.codeCipher) : null;
    if (code) {
      await setCaptchaCookie({
        cookieName: options.cookieName,
        challengeId: existing.id,
        audience: options.audience,
        sameSite: options.sameSite,
      });
      return code;
    }
  }

  const code = createCaptchaCode();
  try {
    await issueCaptcha({
      cookieName: options.cookieName,
      answer: code,
      audience: options.audience,
      sameSite: options.sameSite,
      dedupeKey,
    });
    return code;
  } catch {
    // Unique conflict: a parallel request created the bucket challenge first.
    const winner = await db.captchaChallenge.findUnique({
      where: { dedupeKey },
      select: { id: true, codeCipher: true, expiresAt: true },
    });
    const winnerCode = winner?.codeCipher ? decryptCaptchaCode(winner.codeCipher) : null;
    if (winner && winner.expiresAt.getTime() > Date.now() && winnerCode) {
      await setCaptchaCookie({
        cookieName: options.cookieName,
        challengeId: winner.id,
        audience: options.audience,
        sameSite: options.sameSite,
      });
      return winnerCode;
    }
    // Fallback: dedupe-free issue so the request never fails.
    await issueCaptcha({
      cookieName: options.cookieName,
      answer: code,
      audience: options.audience,
      sameSite: options.sameSite,
    });
    return code;
  }
}

export async function issueAdminCaptcha(answer: string) {
  return issueCaptcha({
    cookieName: CAPTCHA_COOKIE,
    answer,
    audience: "admin",
    sameSite: "lax",
  });
}

export async function resolveAdminCaptchaCode(fresh: boolean) {
  return resolveCaptchaCode({
    cookieName: CAPTCHA_COOKIE,
    audience: "admin",
    sameSite: "lax",
    fresh,
  });
}

export async function verifyCaptcha(answer: string) {
  return verifyCaptchaAnswer({ cookieName: CAPTCHA_COOKIE, answer, audience: "admin" });
}
