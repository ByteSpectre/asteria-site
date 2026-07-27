import { randomBytes, randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { createCaptchaToken } from "@/lib/server/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function createCode() {
  return Array.from({ length: 5 }, () => ALPHABET[randomInt(0, ALPHABET.length)]).join("");
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const code = createCode();
  const token = await createCaptchaToken(code);
  const seed = randomBytes(8).toString("hex");
  const rotations = Array.from({ length: code.length }, () => randomInt(-16, 17));

  const letters = code
    .split("")
    .map((letter, index) => {
      const x = 26 + index * 31;
      const y = 48 + randomInt(-4, 5);
      return `<text x="${x}" y="${y}" transform="rotate(${rotations[index]} ${x} ${y})">${escapeXml(letter)}</text>`;
    })
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="190" height="64" viewBox="0 0 190 64">
    <rect width="190" height="64" fill="#f5f1e8"/>
    <path d="M4 17 C52 51, 122 2, 186 43 M2 52 C60 5, 128 64, 188 21" fill="none" stroke="#431c26" stroke-opacity=".2" stroke-width="1.2"/>
    <g font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="600" fill="#2c1119" letter-spacing="2">${letters}</g>
    <text x="178" y="59" text-anchor="end" font-family="monospace" font-size="6" fill="#431c26" fill-opacity=".28">${escapeXml(seed.slice(0, 6))}</text>
  </svg>`;

  const response = new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
  response.cookies.set("asteria_admin_captcha", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 5,
  });
  return response;
}
