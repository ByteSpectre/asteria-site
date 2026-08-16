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

function lockPageScroll() {
  const scrollbarWidth = Math.max(
    0,
    window.innerWidth - document.documentElement.clientWidth,
  );

  const previous = {
    bodyOverflow: document.body.style.overflow,
    htmlOverflow: document.documentElement.style.overflow,
    bodyPaddingRight: document.body.style.paddingRight,
    compensation: document.documentElement.style.getPropertyValue(
      "--scrollbar-compensation",
    ),
  };

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  if (scrollbarWidth > 0) {
    const pad = `${scrollbarWidth}px`;
    document.body.style.paddingRight = pad;
    document.documentElement.style.setProperty("--scrollbar-compensation", pad);
  }

  document.body.classList.add("contact-form-open");

  return () => {
    document.documentElement.style.overflow = previous.htmlOverflow;
    document.body.style.overflow = previous.bodyOverflow;
    document.body.style.paddingRight = previous.bodyPaddingRight;
    if (previous.compensation) {
      document.documentElement.style.setProperty(
        "--scrollbar-compensation",
        previous.compensation,
      );
    } else {
      document.documentElement.style.removeProperty("--scrollbar-compensation");
    }
    document.body.classList.remove("contact-form-open");
  };
}

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
    return lockPageScroll();
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
