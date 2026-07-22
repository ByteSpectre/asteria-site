"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  once?: boolean;
};

export default function Reveal({
  children,
  className = "",
  y = 36,
  delay = 0,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { clearProps: "all" });
        return;
      }

      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
