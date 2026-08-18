import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "node:crypto";
import { EncryptJWT, jwtDecrypt, jwtVerify, SignJWT } from "jose";

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
export function useSecureCookies() {
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
    secure: useSecureCookies(),
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

export async function createCaptchaToken(answer: string) {
  return new EncryptJWT({ answer: answer.toUpperCase(), kind: "captcha" })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuer(TOKEN_ISSUER)
    .setAudience(TOKEN_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("5m")
    .encrypt(getEncryptionKey());
}

export async function setCaptchaCookie(token: string) {
  const store = await cookies();
  store.set(CAPTCHA_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: useSecureCookies(),
    path: "/",
    maxAge: 60 * 5,
  });
}

export async function verifyCaptcha(answer: string) {
  const store = await cookies();
  const token = store.get(CAPTCHA_COOKIE)?.value;
  store.delete(CAPTCHA_COOKIE);
  if (!token) return false;

  try {
    const { payload } = await jwtDecrypt(token, getEncryptionKey(), {
      keyManagementAlgorithms: ["dir"],
      contentEncryptionAlgorithms: ["A256GCM"],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    });
    return payload.kind === "captcha" && payload.answer === answer.trim().toUpperCase();
  } catch {
    return false;
  }
}
