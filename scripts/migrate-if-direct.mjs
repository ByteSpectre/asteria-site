import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

/** Load root .env into process.env without adding a dotenv dependency. */
function loadEnvFile() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

/**
 * Supabase transaction pooler (:6543) hangs on `prisma migrate deploy`.
 * Prefer DIRECT_URL; on Vercel + Supabase integration use POSTGRES_URL_NON_POOLING.
 * On VPS / local Postgres DATABASE_URL alone is enough.
 */
const connection =
  process.env.DIRECT_URL?.trim() ||
  process.env.POSTGRES_URL_NON_POOLING?.trim() ||
  process.env.DATABASE_URL?.trim();

if (!connection) {
  console.warn(
    "[migrate] No DIRECT_URL, POSTGRES_URL_NON_POOLING, or DATABASE_URL — skipping prisma migrate deploy.",
  );
  process.exit(0);
}

if (/:6543\b/.test(connection) && /pooler\.supabase\.com/i.test(connection)) {
  console.error(
    "[migrate] Connection still points at Supabase transaction pooler (:6543).\n" +
      "On VPS use local Postgres. On Supabase set DIRECT_URL to :5432.",
  );
  process.exit(1);
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
