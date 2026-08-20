import { randomBytes, randomInt } from "node:crypto";

export const CAPTCHA_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function createCaptchaCode() {
  return Array.from(
    { length: 5 },
    () => CAPTCHA_ALPHABET[randomInt(0, CAPTCHA_ALPHABET.length)],
  ).join("");
}

/**
 * Hand-drawn stroke glyphs on a 13x22 grid. Characters are emitted as path
 * data only — never as <text> — so the code cannot be scraped from the SVG
 * markup with a regex and requires real OCR to read.
 */
const GLYPHS: Record<string, string> = {
  "2": "M1 5 C1 1 11 1 11 5 C11 9 1 13 1 20 L12 20",
  "3": "M1 3 C5 0 11 1 11 5 C11 9 7 10 5 10 C8 10 12 12 12 16 C12 20 4 21 1 17",
  "4": "M8 20 L8 1 L1 14 L12 14",
  "5": "M11 1 L2 1 L1 9 C5 7 12 8 12 14 C12 20 4 21 1 16",
  "6": "M11 3 C7 0 2 2 2 9 L2 14 C2 19 5 21 7 21 C10 21 12 18 12 15 C12 11 10 9 6 9 C3 9 2 11 2 13",
  "7": "M1 1 L12 1 L5 20",
  "8": "M6 1 C9 1 11 3 11 5.5 C11 8 9 10 6 10 C3 10 1 8 1 5.5 C1 3 3 1 6 1 M6 10 C9.5 10 12 12 12 15.5 C12 19 9 21 6 21 C3 21 0 19 0 15.5 C0 12 2.5 10 6 10",
  "9": "M1 17 C5 21 11 19 11 12 L11 6 C11 2 8 0 6 0 C3 0 1 2 1 5 C1 9 3 11 7 11 C10 11 11 9 11 7",
  A: "M1 20 L6 1 L11 20 M3 13 L9 13",
  B: "M2 1 L2 20 M2 1 L7 1 C11 1 11 10 7 10 L2 10 M7 10 C12 10 12 20 7 20 L2 20",
  C: "M12 4 C9 0 4 0 2 4 C0 8 0 13 2 17 C4 21 10 20 12 16",
  D: "M2 1 L2 20 L6 20 C11 20 13 16 13 10 C13 5 11 1 6 1 L2 1",
  E: "M11 1 L2 1 L2 20 L12 20 M2 10 L9 10",
  F: "M12 1 L2 1 L2 20 M2 10 L9 10",
  G: "M12 4 C10 0 4 0 2 4 C0 8 0 14 2 17 C4 21 10 21 12 17 L12 12 L8 12",
  H: "M2 1 L2 20 M12 1 L12 20 M2 10 L12 10",
  J: "M10 1 L10 15 C10 20 3 21 1 16",
  K: "M2 1 L2 20 M12 1 L2 11 M5 8 L12 20",
  M: "M1 20 L1 1 L6 11 L11 1 L11 20",
  N: "M1 20 L1 1 L11 20 L11 1",
  P: "M2 20 L2 1 L7 1 C11 1 11 10 7 10 L2 10",
  Q: "M6 1 C10 1 12 5 12 10 C12 16 10 20 6 20 C2 20 0 16 0 10 C0 5 2 1 6 1 M8 16 L13 22",
  R: "M2 20 L2 1 L7 1 C11 1 11 10 7 10 L2 10 M7 10 L12 20",
  S: "M11 4 C9 0 3 0 2 5 C1 9 11 10 11 15 C11 20 4 21 1 16",
  T: "M0 1 L12 1 M6 1 L6 20",
  U: "M1 1 L1 14 C1 19 4 21 6 21 C8 21 11 19 11 14 L11 1",
  V: "M1 1 L6 20 L11 1",
  W: "M0 1 L3 20 L6 9 L9 20 L12 1",
  X: "M1 1 L12 20 M12 1 L1 20",
  Y: "M0 1 L6 9 L12 1 M6 9 L6 20",
  Z: "M1 1 L12 1 L1 20 L12 20",
};

function noiseStroke() {
  const x1 = randomInt(0, 60);
  const y1 = randomInt(4, 60);
  const x2 = x1 + randomInt(40, 120);
  const y2 = randomInt(4, 60);
  const cx1 = x1 + randomInt(10, 50);
  const cy1 = randomInt(0, 64);
  const cx2 = x2 - randomInt(10, 50);
  const cy2 = randomInt(0, 64);
  return `M${x1} ${y1} C${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
}

export function renderCaptchaSvg(
  code: string,
  palette: { background: string; ink: string; noise: string },
) {
  const letters = code
    .split("")
    .map((letter, index) => {
      const glyph = GLYPHS[letter];
      if (!glyph) return "";
      const x = 14 + index * 32;
      const y = 20 + randomInt(-3, 4);
      const rotation = randomInt(-14, 15);
      const scale = 1.05 + randomInt(0, 25) / 100;
      const skew = randomInt(-8, 9);
      return `<g transform="translate(${x} ${y}) rotate(${rotation}) skewX(${skew}) scale(${scale.toFixed(2)})"><path d="${glyph}" fill="none" stroke="${palette.ink}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    })
    .join("");

  const noise = Array.from({ length: 3 }, noiseStroke)
    .map(
      (d) =>
        `<path d="${d}" fill="none" stroke="${palette.noise}" stroke-opacity=".22" stroke-width="1.1"/>`,
    )
    .join("");

  const specks = Array.from({ length: 10 }, () => {
    const cx = randomInt(4, 186);
    const cy = randomInt(4, 60);
    return `<circle cx="${cx}" cy="${cy}" r="0.9" fill="${palette.noise}" fill-opacity=".18"/>`;
  }).join("");

  const seed = randomBytes(4).toString("hex");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="190" height="64" viewBox="0 0 190 64">
  <rect width="190" height="64" fill="${palette.background}"/>
  ${noise}
  ${specks}
  ${letters}
  <circle cx="183" cy="58" r="1.6" fill="${palette.noise}" fill-opacity=".3"/>
  <circle cx="176" cy="58" r="1.1" fill="${palette.noise}" fill-opacity=".22"/>
  <!-- ${seed} -->
</svg>`;
}
