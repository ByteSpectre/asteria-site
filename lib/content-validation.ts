import { z } from "zod";
import { parseCategoryList } from "@/lib/category-list";
import { isSafePreviewImageUrl, sanitizeContentUrls } from "@/lib/safe-url";

const priceItemSchema = z.object({
  title: z.string().trim(),
  price: z.string().trim(),
});

const qaItemSchema = z.object({
  question: z.string().trim(),
  answer: z.string().trim(),
});

const caseItemSchema = z.object({
  title: z.string().trim(),
  court: z.string().trim(),
  role: z.string().trim(),
  complexity: z.string().trim(),
  whatDone: z.string().trim(),
  result: z.string().trim(),
});

export const articleInputSchema = z.object({
  id: z.string().cuid().optional(),
  title: z
    .string({ error: "Заполните поле «Название»." })
    .trim()
    .min(3, "Поле «Название» пусто или слишком короткое. Введите не менее 3 символов.")
    .max(180, "Название слишком длинное — не более 180 символов."),
  category: z
    .string({ error: "Заполните поле «Категория»." })
    .trim()
    .min(2, "Поле «Категория» пусто. Заполните его.")
    .max(500, "Список категорий слишком длинный — не более 500 символов.")
    .refine(
      (value) => parseCategoryList(value).length > 0,
      "Выберите хотя бы одну категорию.",
    ),
  excerpt: z
    .string()
    .trim()
    .max(500, "Краткое описание слишком длинное — не более 500 символов.")
    .optional()
    .default(""),
  previewImage: z
    .string()
    .trim()
    .max(2000, "Ссылка на превью слишком длинная.")
    .refine(
      (value) => !value || isSafePreviewImageUrl(value),
      "Недопустимая ссылка на превью. Используйте https:// или загрузку с сайта.",
    )
    .optional()
    .default(""),
  content: z
    .array(z.record(z.string(), z.unknown()), {
      error: "Добавьте содержимое статьи.",
    })
    .min(1, "Добавьте содержимое статьи.")
    .max(1000, "Статья слишком большая — уменьшите объём текста.")
    .transform((value) => sanitizeContentUrls(value) as Record<string, unknown>[]),
  published: z.boolean(),
});

export const serviceInputSchema = z.object({
  id: z.string().cuid().optional(),
  title: z
    .string({ error: "Заполните поле «Название»." })
    .trim()
    .min(3, "Поле «Название» пусто или слишком короткое. Введите не менее 3 символов."),
  category: z
    .string({ error: "Заполните поле «Категория»." })
    .trim()
    .min(2, "Поле «Категория» пусто. Заполните его."),
  summary: z.string().trim().optional().default(""),
  pricing: z.array(priceItemSchema).default([]),
  scopeItems: z.array(qaItemSchema).default([]),
  faqItems: z.array(qaItemSchema).default([]),
  cases: z.array(caseItemSchema).default([]),
  published: z.boolean(),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;
export type ServiceInput = z.infer<typeof serviceInputSchema>;

const FIELD_LABELS: Record<string, string> = {
  title: "Название",
  category: "Категория",
  excerpt: "Краткое описание",
  previewImage: "Превью",
  summary: "Описание",
  pricing: "Прайс",
  scopeItems: "Практика",
  faqItems: "Вопросы",
  cases: "Дела",
  content: "Содержимое",
  published: "Публикация",
};

/** Превращает ошибки Zod в понятный текст для админ-форм. */
export function formatValidationError(error: z.ZodError): string {
  const messages = error.issues.map((issue) => {
    if (issue.message && !issue.message.startsWith("Invalid") && !issue.message.startsWith("Expected")) {
      return issue.message;
    }

    const field = issue.path[0];
    const label = typeof field === "string" ? FIELD_LABELS[field] ?? field : "Форма";

    if (issue.code === "too_small") {
      return `Поле «${label}» пусто. Заполните его.`;
    }
    if (issue.code === "too_big") {
      return `Поле «${label}» слишком длинное.`;
    }
    if (issue.code === "invalid_type") {
      return `Поле «${label}» заполнено неверно. Проверьте значение.`;
    }

    return `Проверьте поле «${label}».`;
  });

  return [...new Set(messages)].join(" ");
}

export function parseArticleInput(input: unknown): ArticleInput {
  const result = articleInputSchema.safeParse(input);
  if (!result.success) {
    throw new Error(formatValidationError(result.error));
  }
  return result.data;
}

export function parseServiceInput(input: unknown): ServiceInput {
  const result = serviceInputSchema.safeParse(input);
  if (!result.success) {
    throw new Error(formatValidationError(result.error));
  }
  return result.data;
}

/** Клиентская проверка перед отправкой — без вызова сервера. */
export function getArticleValidationMessage(input: unknown): string | null {
  const result = articleInputSchema.safeParse(input);
  return result.success ? null : formatValidationError(result.error);
}

export function getServiceValidationMessage(input: unknown): string | null {
  const result = serviceInputSchema.safeParse(input);
  return result.success ? null : formatValidationError(result.error);
}
