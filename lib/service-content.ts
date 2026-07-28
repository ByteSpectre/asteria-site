export type ServicePriceItem = {
  title: string;
  price: string;
};

export type ServiceQaItem = {
  question: string;
  answer: string;
};

export type ServiceCaseItem = {
  title: string;
  court: string;
  role: string;
  complexity: string;
  whatDone: string;
  result: string;
};

export type ServiceTemplateContent = {
  pricing: ServicePriceItem[];
  scope: ServiceQaItem[];
  faq: ServiceQaItem[];
  cases: ServiceCaseItem[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeServicePricing(value: unknown): ServicePriceItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = asRecord(item);
      if (!row) return null;
      const title = readString(row.title);
      const price = readString(row.price);
      if (!title && !price) return null;
      return { title, price };
    })
    .filter((item): item is ServicePriceItem => item !== null);
}

export function normalizeServiceQa(value: unknown): ServiceQaItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = asRecord(item);
      if (!row) return null;
      const question = readString(row.question);
      const answer = readString(row.answer);
      if (!question && !answer) return null;
      return { question, answer };
    })
    .filter((item): item is ServiceQaItem => item !== null);
}

export function normalizeServiceCases(value: unknown): ServiceCaseItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = asRecord(item);
      if (!row) return null;
      const title = readString(row.title);
      const court = readString(row.court);
      const role = readString(row.role);
      const complexity = readString(row.complexity);
      const whatDone = readString(row.whatDone);
      const result = readString(row.result);
      if (!title && !court && !role && !complexity && !whatDone && !result) return null;
      return { title, court, role, complexity, whatDone, result };
    })
    .filter((item): item is ServiceCaseItem => item !== null);
}

export function emptyPriceItem(): ServicePriceItem {
  return { title: "", price: "" };
}

export function emptyQaItem(): ServiceQaItem {
  return { question: "", answer: "" };
}

export function emptyCaseItem(): ServiceCaseItem {
  return {
    title: "",
    court: "",
    role: "",
    complexity: "",
    whatDone: "",
    result: "",
  };
}
