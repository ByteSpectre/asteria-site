/**
 * Resolve admin bcrypt hash from env.
 * Next.js dotenv expands `$VAR` inside values and corrupts bcrypt hashes that contain `$`.
 * Prefer ADMIN_PASSWORD_HASH_B64 (base64 of the full hash) on WSL/VPS/Linux.
 */
export function getAdminPasswordHash(): string | null {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64?.trim();
  if (b64) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8").trim();
      if (isBcryptHash(decoded)) return decoded;
    } catch {
      // fall through
    }
  }

  const raw = process.env.ADMIN_PASSWORD_HASH?.trim() ?? "";
  if (isBcryptHash(raw)) return raw;
  return null;
}

function isBcryptHash(value: string) {
  return /^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value);
}
