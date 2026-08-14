"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Arrow from "@/components/Arrow";
import { useContactForm } from "@/components/contact/ContactFormProvider";

type Props = {
  children: ReactNode;
  className?: string;
  serviceName?: string;
  showArrow?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "type">;

export default function LeadButton({
  children,
  className = "",
  serviceName,
  showArrow = true,
  onClick,
  ...rest
}: Props) {
  const { openLeadForm } = useContactForm();

  return (
    <button
      type="button"
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        openLeadForm(
          serviceName
            ? { type: "service", serviceName }
            : { type: "consultation" },
        );
      }}
      className={`group inline-flex cursor-pointer items-center justify-center gap-3 ${className}`}
    >
      {children}
      {showArrow ? (
        <Arrow className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      ) : null}
    </button>
  );
}
