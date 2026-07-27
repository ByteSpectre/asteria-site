const IMAGE_URL_PATTERN = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;

export function isImageUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (IMAGE_URL_PATTERN.test(trimmed)) return true;
  if (/^https?:\/\//i.test(trimmed) && /image|blob|uploads|cdn|media|photo|static/i.test(trimmed)) {
    return true;
  }
  return false;
}

export function normalizeImageUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) return trimmed;
  if (/^[\w.-]+\.[\w.-]+/.test(trimmed)) return `https://${trimmed}`;

  return "";
}
