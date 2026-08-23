"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import CookieConsent from "@/components/CookieConsent";
import { ContactFormProvider } from "@/components/contact/ContactFormProvider";

/** Public marketing chrome — skipped on /admin to keep the panel snappy. */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return children;
  }

  return (
    <ContactFormProvider>
      <SmoothScroll>
        {children}
        <CustomCursor />
        <CookieConsent />
      </SmoothScroll>
    </ContactFormProvider>
  );
}
