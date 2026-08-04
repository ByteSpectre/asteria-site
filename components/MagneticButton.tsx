"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href: string;
  className?: string;
  strength?: number;
  target?: string;
  rel?: string;
};

export default function MagneticButton({
  children,
  href,
  className = "",
  target,
  rel,
}: Props) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`group inline-flex cursor-pointer items-center justify-center gap-3 ${className}`}
    >
      {children}
    </a>
  );
}
