import { z } from "zod";

export const articleInputSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().trim().min(3, "Введите название статьи").max(180),
  category: z.string().trim().min(2, "Введите категорию").max(80),
  excerpt: z.string().trim().max(500).optional().default(""),
  content: z.array(z.record(z.string(), z.unknown())).min(1).max(1000),
  published: z.boolean(),
});

export const serviceInputSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().trim().min(3, "Введите название услуги").max(180),
  category: z.string().trim().min(2, "Введите категорию").max(80),
  summary: z.string().trim().max(1000).optional().default(""),
  published: z.boolean(),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;
export type ServiceInput = z.infer<typeof serviceInputSchema>;
