import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "node:crypto";
import { EncryptJWT, jwtDecrypt, jwtVerify, SignJWT } from "jose";
import { getDb } from "@/lib/server/db";

const SESSION_COOKIE = "asteria_admin_session";
const CAPTCHA_COOKIE = "asteria_admin_captcha";
const TOKEN_ISSUER = "asteria-site";
const TOKEN_AUDIENCE = "asteria-admin";

type AdminSession = {
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

export async function createAdminSession(login: string) {
  const token = await signToken({ login, role: "ADMIN", kind: "session" }, "8h");
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
    if (payload.kind !== "session" || payload.role !== "ADMIN" || typeof payload.login !== "string") {
      return null;
    }
    return { login: payload.login, role: "ADMIN" };
  } catch {
    return null;
  }
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
}) {
  const db = getDb();
  const challenge = await db.captchaChallenge.create({
    data: {
      answerHash: hashCaptchaAnswer(options.answer),
      audience: options.audience,
      expiresAt: new Date(Date.now() + CAPTCHA_TTL_MS),
    },
    select: { id: true },
  });

  db.captchaChallenge
    .deleteMany({ where: { expiresAt: { lt: new Date() } } })
    .catch(() => undefined);

  const token = await new EncryptJWT({
    kind: "captcha",
    challengeId: challenge.id,
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

export async function issueAdminCaptcha(answer: string) {
  return issueCaptcha({
    cookieName: CAPTCHA_COOKIE,
    answer,
    audience: "admin",
    sameSite: "lax",
  });
}

export async function verifyCaptcha(answer: string) {
  return verifyCaptchaAnswer({ cookieName: CAPTCHA_COOKIE, answer, audience: "admin" });
}
