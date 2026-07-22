import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const url = process.argv[2] ?? "http://localhost:3000/";
const outDir = path.resolve("screenshots");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outFile = path.join(outDir, `chrome-${stamp}.png`);

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
});

const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: outFile, fullPage: true });
await browser.close();

console.log(outFile);
