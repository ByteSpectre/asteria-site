"use client";

import {
  createContext,
  useCallback,
  useContext,
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
