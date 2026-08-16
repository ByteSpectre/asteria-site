import { spawnSync } from "node:child_process";

/**
 * Supabase transaction pooler (:6543) hangs on `prisma migrate deploy`.
 * Migrations must use DIRECT_URL (db.<ref>.supabase.co:5432 or session pooler :5432).
 * Skip migrate in build when DIRECT_URL is missing so deploys don't stall.
 */
const direct = process.env.DIRECT_URL?.trim();

if (!direct) {
  console.warn(
    "[build] DIRECT_URL is not set — skipping prisma migrate deploy.\n" +
      "Add DIRECT_URL in Vercel (Supabase → Database → Direct connection :5432),\n" +
      "then redeploy so future migrations apply automatically.",
  );
  process.exit(0);
}

if (/:6543\b/.test(direct) && /pooler\.supabase\.com/i.test(direct)) {
  console.error(
    "[build] DIRECT_URL still points at Supabase transaction pooler (:6543).\n" +
      "Use db.<project>.supabase.co:5432 or session pooler :5432.",
  );
  process.exit(1);
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
