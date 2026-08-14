import { z } from "zod";

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitizeText(value: string, max: number) {
  return value.replace(CONTROL_CHARS, "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function digitsOnlyPhone(value: string) {
  return value.replace(/\D/g, "");
}

/** Format as +7 (XXX) XXX-XX-XX while typing. */
export function formatRuPhoneMask(input: string) {
  let digits = digitsOnlyPhone(input);
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (digits.length > 0 && !digits.startsWith("7")) digits = `7${digits}`;
  digits = digits.slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length === 1) return "+7";

  const rest = digits.slice(1);
  const a = rest.slice(0, 3);
  const b = rest.slice(3, 6);
  const c = rest.slice(6, 8);
  const d = rest.slice(8, 10);

  let out = "+7";
  if (a) out += ` (${a}`;
  if (a.length === 3) out += ")";
  if (b) out += ` ${b}`;
  if (c) out += `-${c}`;
  if (d) out += `-${d}`;
  return out;
}

export function isCompleteRuPhone(value: string) {
  return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value);
}

export const contactLeadSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Укажите почту")
      .max(254, "Слишком длинная почта")
      .email("Некорректный адрес почты"),
    phone: z
      .string()
      .trim()
      .max(20)
      .optional()
      .transform((value) => value ?? "")
      .refine((value) => value === "" || isCompleteRuPhone(value), {
        message: "Введите номер в формате +7 (999) 123-45-67",
      }),
    serviceName: z.string().trim().max(200).optional(),
    mode: z.enum(["consultation", "service"]),
    captcha: z.string().trim().min(1, "Введите код с изображения").max(8),
    // Honeypot — must stay empty
    companyWebsite: z.string().max(0).optional(),
    // Form open timestamp (ms) — reject instant bots
    openedAt: z.coerce.number().int().positive(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "service") {
      const name = data.serviceName?.trim() ?? "";
      if (!name) {
        ctx.addIssue({
          code: "custom",
          path: ["serviceName"],
          message: "Не указана услуга",
        });
      }
    }
  });

export type ContactLeadInput = z.infer<typeof contactLeadSchema>;

export type ContactFormMode =
  | { type: "consultation" }
  | { type: "service"; serviceName: string };
