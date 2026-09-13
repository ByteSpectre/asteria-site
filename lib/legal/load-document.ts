import { readFile } from "node:fs/promises";
import path from "node:path";

const POLICY_URL = "https://asteria-law.ru/privacy";

/** Fill blanks left in source Word drafts; keep legal wording otherwise intact. */
function prepareLegalText(text: string) {
  return text
    .replace(
      /размещенной по адресу:\s*_+/gi,
      `размещенной по адресу: ${POLICY_URL}`,
    )
    .replace(
      /размещённой по адресу:\s*_+/gi,
      `размещённой по адресу: ${POLICY_URL}`,
    )
    .trim();
}

export async function loadLegalDocument(filename: string) {
  const filePath = path.join(process.cwd(), "content", "legal", filename);
  const raw = await readFile(filePath, "utf8");
  const normalized = raw.replace(/\r\n/g, "\n");
  const separator = normalized.indexOf("\n---\n");
  const body =
    separator >= 0 ? normalized.slice(separator + "\n---\n".length) : normalized;
  return prepareLegalText(body);
}
