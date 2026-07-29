"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
  /** CSS selector for items inside the container */
  itemSelector?: string;
  /** Re-run when this changes (filters, query, etc.) */
  deps?: unknown[];
};

export default function RevealStagger({
  children,
  className = "",
  y = 28,
  stagger = 0.07,
  itemSelector = "[data-reveal-item]",
  deps = [],
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const items = gsap.utils.toArray<HTMLElement>(itemSelector, root);
      if (!items.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(items, { clearProps: "all" });
        return;
      }

      gsap.set(items, { autoAlpha: 0, y });
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref, dependencies: deps },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
