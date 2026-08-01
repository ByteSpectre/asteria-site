import { SOCIAL_LINKS } from "@/lib/data";

/** Primary messenger CTA for service pages (WhatsApp). */
export const MESSENGER_HREF =
  SOCIAL_LINKS.find((item) => item.label === "WhatsApp")?.href ??
  "https://wa.me/79953013834";

export const MESSENGER_LABEL = "Написать в мессенджер";
