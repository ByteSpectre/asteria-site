import type { ReactNode } from "react";
import Link from "next/link";
import { LEGAL_LINKS } from "@/lib/legal";

const SECTION_RE = /^\d+\.\s+\S/;
const SUBSECTION_RE = /^\d+\.\d+(\.\d+)?\.\s+/;
const BULLET_RE = /^(—|-|•)\s+/;
const LETTER_ITEM_RE = /^[а-яa-z]\)\s+/i;

const LINK_DEFS: Array<{ pattern: RegExp; href: string }> = [
  {
    pattern: /\[Политик[аеиуюя]* обработки персональных данных\]/gi,
    href: LEGAL_LINKS.privacy.href,
  },
  {
    pattern: /\[Пользовательск[^\]]*соглашени[^\]]*\]/gi,
    href: LEGAL_LINKS.terms.href,
  },
];

function linkify(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let earliest: { index: number; length: number; href: string; label: string } | null =
      null;

    for (const def of LINK_DEFS) {
      def.pattern.lastIndex = 0;
      const match = def.pattern.exec(remaining);
      if (!match || match.index === undefined) continue;
      if (!earliest || match.index < earliest.index) {
        earliest = {
          index: match.index,
          length: match[0].length,
          href: def.href,
          label: match[0].replace(/^\[|\]$/g, ""),
        };
      }
    }

    const urlMatch = /https?:\/\/[^\s)>\]]+/i.exec(remaining);
    if (urlMatch && urlMatch.index !== undefined) {
      if (!earliest || urlMatch.index < earliest.index) {
        earliest = {
          index: urlMatch.index,
          length: urlMatch[0].length,
          href: urlMatch[0],
          label: urlMatch[0],
        };
      }
    }

    if (!earliest) {
      nodes.push(remaining);
      break;
    }

    if (earliest.index > 0) {
      nodes.push(remaining.slice(0, earliest.index));
    }

    const isExternal = /^https?:\/\//i.test(earliest.href);
    if (isExternal) {
      nodes.push(
        <a
          key={`a-${key++}`}
          href={earliest.href}
          className="link-underline text-ink/80 hover:text-wine"
          target="_blank"
          rel="noopener noreferrer"
        >
          {earliest.label}
        </a>,
      );
    } else {
      nodes.push(
        <Link
          key={`l-${key++}`}
          href={earliest.href}
          className="link-underline text-ink/80 hover:text-wine"
        >
          {earliest.label}
        </Link>,
      );
    }

    remaining = remaining.slice(earliest.index + earliest.length);
  }

  return nodes;
}

function isTitleLine(line: string, index: number) {
  if (index > 2) return false;
  return (
    line === line.toUpperCase() &&
    /[А-ЯA-Z]/.test(line) &&
    !SECTION_RE.test(line)
  );
}

export function renderLegalDocument(text: string) {
  const lines = text.split(/\r?\n/);
  const elements: ReactNode[] = [];
  let listBuffer: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={`ul-${key++}`} className="mt-4 list-none space-y-2 pl-0">
        {listBuffer.map((item, index) => (
          <li
            key={`li-${key}-${index}`}
            className="type-body-sm relative pl-5 text-ink/70 before:absolute before:left-0 before:content-['—']"
          >
            {linkify(item)}
          </li>
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      return;
    }

    if (BULLET_RE.test(line)) {
      listBuffer.push(line.replace(BULLET_RE, ""));
      return;
    }

    flushList();

    if (isTitleLine(line, index)) {
      // Document title is rendered by the page H1 — skip duplicate ALL-CAPS title.
      if (index === 0) return;
      elements.push(
        <p key={`meta-${key++}`} className="type-body-sm mt-2 text-ink/50">
          {linkify(line)}
        </p>,
      );
      return;
    }

    if (SECTION_RE.test(line) && !SUBSECTION_RE.test(line)) {
      elements.push(
        <h2
          key={`h2-${key++}`}
          className="type-feature-name mt-12 scroll-mt-28 text-ink first:mt-8"
        >
          {line}
        </h2>,
      );
      return;
    }

    if (SUBSECTION_RE.test(line) || LETTER_ITEM_RE.test(line)) {
      elements.push(
        <p key={`sub-${key++}`} className="type-body-sm mt-4 text-ink/70">
          {linkify(line)}
        </p>,
      );
      return;
    }

    elements.push(
      <p key={`p-${key++}`} className="type-body-sm mt-4 text-ink/70">
        {linkify(line)}
      </p>,
    );
  });

  flushList();
  return elements;
}
