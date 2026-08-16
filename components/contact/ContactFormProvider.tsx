"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ContactFormMode } from "@/lib/contact-form";
import ContactFormModal from "@/components/contact/ContactFormModal";

type ContactFormContextValue = {
  openLeadForm: (mode?: ContactFormMode) => void;
  closeLeadForm: () => void;
};

const ContactFormContext = createContext<ContactFormContextValue | null>(null);

export function ContactFormProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ContactFormMode>({ type: "consultation" });

  const openLeadForm = useCallback((next?: ContactFormMode) => {
    setMode(next ?? { type: "consultation" });
    setOpen(true);
  }, []);

  const closeLeadForm = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const scrollbarWidth = Math.max(
      0,
      window.innerWidth - document.documentElement.clientWidth,
    );
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const previousCompensation = document.documentElement.style.getPropertyValue(
      "--scrollbar-compensation",
    );

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.setProperty(
        "--scrollbar-compensation",
        `${scrollbarWidth}px`,
      );
    }
    document.body.classList.add("contact-form-open");

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      if (previousCompensation) {
        document.documentElement.style.setProperty(
          "--scrollbar-compensation",
          previousCompensation,
        );
      } else {
        document.documentElement.style.removeProperty("--scrollbar-compensation");
      }
      document.body.classList.remove("contact-form-open");
    };
  }, [open]);

  const value = useMemo(
    () => ({ openLeadForm, closeLeadForm }),
    [openLeadForm, closeLeadForm],
  );

  return (
    <ContactFormContext.Provider value={value}>
      {children}
      <ContactFormModal open={open} mode={mode} onClose={closeLeadForm} />
    </ContactFormContext.Provider>
  );
}

export function useContactForm() {
  const ctx = useContext(ContactFormContext);
  if (!ctx) {
    throw new Error("useContactForm must be used within ContactFormProvider");
  }
  return ctx;
}
