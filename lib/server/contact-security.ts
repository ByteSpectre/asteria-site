import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt } from "jose";
import { createCaptchaToken } from "@/lib/server/auth";
import { consumeRateLimit } from "@/lib/server/rate-limit";

const CONTACT_CAPTCHA_COOKIE = "asteria_contact_captcha";
const CONTACT_FORM_COOKIE = "asteria_contact_form";
const TOKEN_ISSUER = "asteria-site";
const TOKEN_AUDIENCE = "asteria-contact";

const MIN_FILL_MS = 2500;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;

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
  const nonce = randomBytes(12).toString("hex");
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
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 30,
  });

  return { openedAt, nonce };
}

export async function setContactCaptchaCookie(answer: string) {
  const token = await createCaptchaToken(answer);
  const store = await cookies();
  store.set(CONTACT_CAPTCHA_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 5,
  });
}

export async function verifyContactCaptcha(answer: string) {
  const store = await cookies();
  const token = store.get(CONTACT_CAPTCHA_COOKIE)?.value;
  store.delete(CONTACT_CAPTCHA_COOKIE);
  if (!token) return false;

  try {
    const { payload } = await jwtDecrypt(token, getEncryptionKey(), {
      keyManagementAlgorithms: ["dir"],
      contentEncryptionAlgorithms: ["A256GCM"],
      issuer: "asteria-site",
      audience: "asteria-admin",
    });
    return payload.kind === "captcha" && payload.answer === answer.trim().toUpperCase();
  } catch {
    return false;
  }
}

export async function assertContactSubmissionTiming(openedAt: number, nonce: string) {
  const store = await cookies();
  const token = store.get(CONTACT_FORM_COOKIE)?.value;
  if (!token) return { ok: false as const, error: "Обновите форму и попробуйте снова." };

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
      return { ok: false as const, error: "Обновите форму и попробуйте снова." };
    }
    if (payload.openedAt !== openedAt || payload.nonce !== nonce) {
      return { ok: false as const, error: "Обновите форму и попробуйте снова." };
    }
    if (Date.now() - payload.openedAt < MIN_FILL_MS) {
      return { ok: false as const, error: "Слишком быстрая отправка. Подождите секунду." };
    }
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Обновите форму и попробуйте снова." };
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
