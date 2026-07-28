import { z } from "zod";
import { parseCategoryList } from "@/lib/category-list";

const priceItemSchema = z.object({
  title: z.string().trim().max(180, "Название позиции прайса слишком длинное."),
  price: z.string().trim().max(80, "Цена слишком длинная."),
});

const qaItemSchema = z.object({
  question: z.string().trim().max(300, "Вопрос слишком длинный."),
  answer: z.string().trim().max(2000, "Ответ слишком длинный."),
});

const caseItemSchema = z.object({
  title: z.string().trim().max(180, "Название дела слишком длинное."),
  court: z.string().trim().max(180, "Поле «Суд» слишком длинное."),
  role: z.string().trim().max(180, "Поле «Роль» слишком длинное."),
  complexity: z.string().trim().max(180, "Поле «Сложность» слишком длинное."),
  whatDone: z.string().trim().max(1000, "Поле «Что сделали» слишком длинное."),
  result: z.string().trim().max(1000, "Поле «Результат» слишком длинное."),
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
    .optional()
    .default(""),
  content: z
    .array(z.record(z.string(), z.unknown()), {
      error: "Добавьте содержимое статьи.",
    })
    .min(1, "Добавьте содержимое статьи.")
    .max(1000, "Статья слишком большая — уменьшите объём текста."),
  published: z.boolean(),
});

export const serviceInputSchema = z.object({
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
    .max(80, "Категория слишком длинная — не более 80 символов."),
  summary: z
    .string()
    .trim()
    .max(1000, "Описание слишком длинное — не более 1000 символов.")
    .optional()
    .default(""),
  pricing: z.array(priceItemSchema).max(50, "Слишком много позиций в прайсе.").default([]),
  scopeItems: z.array(qaItemSchema).max(50, "Слишком много пунктов практики.").default([]),
  faqItems: z.array(qaItemSchema).max(50, "Слишком много вопросов.").default([]),
  cases: z.array(caseItemSchema).max(50, "Слишком много дел.").default([]),
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
