"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  href: string;
  className?: string;
  strength?: number;
};

export default function MagneticButton({
  children,
  href,
  className = "",
  strength = 0.35,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  useGSAP(() => {
    if (!ref.current) return;
    xTo.current = gsap.quickTo(ref.current, "x", { duration: 0.6, ease: "power3.out" });
    yTo.current = gsap.quickTo(ref.current, "y", { duration: 0.6, ease: "power3.out" });
  });

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || !xTo.current || !yTo.current) return;
    const rect = el.getBoundingClientRect();
    xTo.current((e.clientX - rect.left - rect.width / 2) * strength);
    yTo.current((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const onLeave = () => {
    xTo.current?.(0);
    yTo.current?.(0);
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group inline-flex cursor-pointer items-center justify-center gap-3 ${className}`}
    >
      {children}
    </a>
  );
}
