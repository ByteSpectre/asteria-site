"use server";

import {
  contactLeadSchema,
  sanitizeText,
} from "@/lib/contact-form";
import { sendContactLeadEmail } from "@/lib/server/contact-mail";
import {
  assertContactSubmissionTiming,
  consumeContactRateLimit,
  issueContactFormToken,
  verifyContactCaptcha,
} from "@/lib/server/contact-security";

export type ContactLeadState = {
  ok?: boolean;
  error?: string;
  refresh: number;
};

export async function prepareContactFormAction() {
  return issueContactFormToken();
}

export async function submitContactLeadAction(
  _prev: ContactLeadState,
  formData: FormData,
): Promise<ContactLeadState> {
  const refresh = Date.now();

  const rate = await consumeContactRateLimit();
  if (!rate.allowed) {
    return {
      error: "Слишком много заявок. Повторите через 15 минут.",
      refresh,
    };
  }

  const honeypot = String(formData.get("companyWebsite") ?? "");
  if (honeypot.trim().length > 0) {
    // Silent success for bots
    return { ok: true, refresh };
  }

  const parsed = contactLeadSchema.safeParse({
    email: sanitizeText(String(formData.get("email") ?? ""), 254),
    phone: sanitizeText(String(formData.get("phone") ?? ""), 20),
    serviceName: sanitizeText(String(formData.get("serviceName") ?? ""), 200),
    mode: String(formData.get("mode") ?? ""),
    captcha: sanitizeText(String(formData.get("captcha") ?? ""), 8),
    companyWebsite: honeypot,
    openedAt: String(formData.get("openedAt") ?? ""),
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Проверьте поля формы.";
    return { error: message, refresh };
  }

  const timing = await assertContactSubmissionTiming(parsed.data.openedAt);
  if (!timing.ok) {
    return { error: timing.error, refresh };
  }

  if (!(await verifyContactCaptcha(parsed.data.captcha))) {
    return {
      error: "Код с изображения введён неверно или устарел.",
      refresh,
    };
  }

  const mail = await sendContactLeadEmail({
    email: parsed.data.email.toLowerCase(),
    phone: parsed.data.phone,
    mode: parsed.data.mode,
    serviceName:
      parsed.data.mode === "service" ? parsed.data.serviceName : undefined,
  });

  if (!mail.ok) {
    return { error: mail.error, refresh };
  }

  return { ok: true, refresh };
}
