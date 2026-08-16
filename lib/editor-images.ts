import { isSafeContentUrl } from "@/lib/safe-url";

const IMAGE_URL_PATTERN = /\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i;

export function isImageUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed || !isSafeContentUrl(trimmed)) return false;
  if (IMAGE_URL_PATTERN.test(trimmed)) return true;
  if (
    /^https?:\/\//i.test(trimmed) &&
    /image|blob|uploads|cdn|media|photo|static/i.test(trimmed)
  ) {
    return true;
  }
  return false;
}

export function normalizeImageUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  let next = trimmed;
  if (/^https?:\/\//i.test(trimmed)) next = trimmed;
  else if (trimmed.startsWith("//")) next = `https:${trimmed}`;
  else if (trimmed.startsWith("/")) next = trimmed;
  else if (/^[\w.-]+\.[\w.-]+/.test(trimmed)) next = `https://${trimmed}`;
  else return "";

  // Block javascript:/data:/svg XSS vectors from paste or typed URLs.
  if (!isSafeContentUrl(next)) return "";
  if (/\.svg(\?|$)/i.test(next)) return "";
  return next;
}
