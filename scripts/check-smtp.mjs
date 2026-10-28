/**
 * Diagnose the lead-form SMTP setup (VPS / local).
 *
 * Run on the server from the project root (reads .env):
 *   npm run mail:check          # connect + auth only
 *   npm run mail:check -- --send  # also send a test letter to CONTACT_TO_EMAIL
 *
 * Prints the exact network/SMTP error code, so a blocked port (ETIMEDOUT) is
 * distinguishable from bad credentials (EAUTH) or a rejected sender (EENVELOPE).
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import nodemailer from "nodemailer";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    if (process.env[key] !== undefined) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile(resolve(process.cwd(), ".env"));
loadEnvFile(resolve(process.cwd(), ".env.production"));

const host = process.env.SMTP_HOST?.trim() || "";
const user = process.env.SMTP_USER?.trim() || "";
const pass = process.env.SMTP_PASS?.trim() || "";
const port = Number(process.env.SMTP_PORT?.trim() || "465");
const secure =
  process.env.SMTP_SECURE?.trim() === "false"
    ? false
    : process.env.SMTP_SECURE?.trim() === "true"
      ? true
      : port === 465;
const to = process.env.CONTACT_TO_EMAIL?.trim() || "";
const from = process.env.CONTACT_FROM_EMAIL?.trim() || `Asteria <${user}>`;
const shouldSend = process.argv.includes("--send");

function maskUser(value) {
  const [name, domain] = value.split("@");
  if (!domain) return value ? "***" : "(empty)";
  return `${name.slice(0, 2)}***@${domain}`;
}

console.log("SMTP configuration");
console.log(`  SMTP_HOST:          ${host || "(empty)"}`);
console.log(`  SMTP_PORT:          ${port}`);
console.log(`  SMTP_SECURE:        ${secure} (implicit TLS)`);
console.log(`  SMTP_USER:          ${maskUser(user)}`);
console.log(`  SMTP_PASS:          ${pass ? `set (${pass.length} chars)` : "EMPTY"}`);
console.log(`  CONTACT_FROM_EMAIL: ${from}`);
console.log(`  CONTACT_TO_EMAIL:   ${to || "EMPTY"}`);

if (!host || !user || !pass || !to) {
  console.error("\n✗ Incomplete configuration — the app cannot send mail in this state.");
  if (!pass) console.error("  SMTP_PASS is empty. For Yandex/Gmail use an app password, not the account password.");
  if (!to) console.error("  CONTACT_TO_EMAIL is empty.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
  connectionTimeout: 15_000,
  greetingTimeout: 15_000,
  socketTimeout: 20_000,
});

function describe(error) {
  const e = /** @type {Record<string, unknown>} */ (error);
  const code = String(e.code ?? "unknown");
  console.error(`\n✗ SMTP failed: ${code}`);
  for (const key of ["errno", "syscall", "address", "port", "command", "responseCode", "response"]) {
    if (e[key] !== undefined) console.error(`  ${key}: ${e[key]}`);
  }
  if (e.message) console.error(`  message: ${e.message}`);

  if (["ETIMEDOUT", "ESOCKET", "ECONNREFUSED", "EHOSTUNREACH", "ENOTFOUND"].includes(code)) {
    console.error(
      "\n→ Network-level failure. On Reg.ru VPS outbound 25/465 are often blocked.\n" +
        "  Try SMTP_PORT=587 + SMTP_SECURE=false (STARTTLS), or ask Reg.ru support to open 587/465.",
    );
  } else if (code === "EAUTH" || String(e.responseCode) === "535") {
    console.error(
      "\n→ Authentication rejected. For Yandex Mail: enable «Пароли приложений» and use\n" +
        "  an app password in SMTP_PASS; SMTP access must be enabled in mail settings.",
    );
  } else if (code === "EENVELOPE") {
    console.error(
      "\n→ Sender/recipient rejected. CONTACT_FROM_EMAIL must be the same mailbox as SMTP_USER.",
    );
  }
}

try {
  await transporter.verify();
  console.log("\n✓ Connection and authentication OK.");

  if (shouldSend) {
    const info = await transporter.sendMail({
      from,
      to,
      subject: "Астерия — тест SMTP",
      text: `Тестовое письмо. ${new Date().toISOString()}`,
    });
    console.log(`✓ Test letter accepted by the server: ${info.messageId}`);
    console.log(`  Check the inbox of ${to} (and the spam folder).`);
  }
} catch (error) {
  describe(error);
  process.exitCode = 1;
} finally {
  transporter.close();
}
