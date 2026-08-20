import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt } from "jose";
import { issueCaptcha, secureCookies, verifyCaptchaAnswer } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { consumeGlobalRateLimit, consumeRateLimit } from "@/lib/server/rate-limit";

const CONTACT_CAPTCHA_COOKIE = "asteria_contact_captcha";
const CONTACT_FORM_COOKIE = "asteria_contact_form";
const TOKEN_ISSUER = "asteria-site";
const TOKEN_AUDIENCE = "asteria-contact";

const MIN_FILL_MS = 2500;
const FORM_TOKEN_TTL_MS = 30 * 60 * 1000;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;
const GLOBAL_RATE_WINDOW_MS = 60 * 60 * 1000;
const GLOBAL_RATE_MAX = 30;

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET должен содержать не менее 32 символов.");
  }
  return new TextEncoder().encode(secret);
}

function getEncryptionKey() {
  return createHash("sha256").update(getSecretKey()).digest();
}

export async function issueContactFormToken() {
  const openedAt = Date.now();
  const nonce = randomBytes(16).toString("hex");

  const db = getDb();
  await db.contactFormToken.create({
    data: {
      nonce,
      openedAt: BigInt(openedAt),
      expiresAt: new Date(openedAt + FORM_TOKEN_TTL_MS),
    },
  });
  db.contactFormToken
    .deleteMany({ where: { expiresAt: { lt: new Date() } } })
    .catch(() => undefined);

  const token = await new EncryptJWT({ kind: "contact-form", openedAt, nonce })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuer(TOKEN_ISSUER)
    .setAudience(TOKEN_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("30m")
    .encrypt(getEncryptionKey());

  const store = await cookies();
  store.set(CONTACT_FORM_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: secureCookies(),
    path: "/",
    maxAge: FORM_TOKEN_TTL_MS / 1000,
  });

  return { openedAt, nonce };
}

export async function setContactCaptcha(answer: string) {
  return issueCaptcha({
    cookieName: CONTACT_CAPTCHA_COOKIE,
    answer,
    audience: "contact",
    sameSite: "strict",
  });
}

export async function verifyContactCaptcha(answer: string) {
  return verifyCaptchaAnswer({
    cookieName: CONTACT_CAPTCHA_COOKIE,
    answer,
    audience: "contact",
  });
}

const FORM_ERROR = { ok: false as const, error: "Обновите форму и попробуйте снова." };

export async function assertContactSubmissionTiming(openedAt: number, nonce: string) {
  const store = await cookies();
  const token = store.get(CONTACT_FORM_COOKIE)?.value;
  if (!token) return FORM_ERROR;

  try {
    const { payload } = await jwtDecrypt(token, getEncryptionKey(), {
      keyManagementAlgorithms: ["dir"],
      contentEncryptionAlgorithms: ["A256GCM"],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    });
    if (
      payload.kind !== "contact-form" ||
      typeof payload.openedAt !== "number" ||
      typeof payload.nonce !== "string"
    ) {
      return FORM_ERROR;
    }
    if (payload.openedAt !== openedAt || payload.nonce !== nonce) {
      return FORM_ERROR;
    }
    if (Date.now() - payload.openedAt < MIN_FILL_MS) {
      return { ok: false as const, error: "Слишком быстрая отправка. Подождите секунду." };
    }

    // Single-use: the server-side record is consumed on first submission,
    // so a captured cookie cannot be replayed for further sends.
    const { count } = await getDb().contactFormToken.deleteMany({
      where: { nonce: payload.nonce, expiresAt: { gt: new Date() } },
    });
    if (count !== 1) return FORM_ERROR;

    return { ok: true as const };
  } catch {
    return FORM_ERROR;
  }
}

export async function consumeContactFormToken() {
  const store = await cookies();
  store.delete(CONTACT_FORM_COOKIE);
}

export async function consumeContactRateLimit() {
  return consumeRateLimit({
    scope: "contact-lead",
    max: RATE_MAX,
    windowMs: RATE_WINDOW_MS,
  });
}

// Global cap independent of any client-derived key: even an attacker who
// rotates IPs cannot push more than GLOBAL_RATE_MAX emails/hour through SMTP.
export async function consumeContactGlobalRateLimit() {
  return consumeGlobalRateLimit({
    scope: "contact-lead",
    max: GLOBAL_RATE_MAX,
    windowMs: GLOBAL_RATE_WINDOW_MS,
  });
}
