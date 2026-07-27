export type ArticleContentValue = Record<string, unknown>[];

const EMPTY_DOCUMENT: ArticleContentValue = [
  {
    type: "paragraph",
    content: [],
  },
];

export function normalizeArticleContent(value: unknown): ArticleContentValue {
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((block) => typeof block === "object" && block !== null && !Array.isArray(block))
  ) {
    return value as ArticleContentValue;
  }

  return EMPTY_DOCUMENT.map((block) => ({ ...block }));
}
