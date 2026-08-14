"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // After client navigations, refresh triggers so page reveals fire correctly.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Lenis перехватывает wheel на странице. Для внутренних скроллов
    // (BlockNote, попап дела) останавливаем перехват.
    const onWheelCapture = (event: WheelEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (
        document.body.classList.contains("case-popup-open") ||
        document.body.classList.contains("contact-form-open")
      ) {
        event.stopImmediatePropagation();
        return;
      }

      const preventRoot = target.closest("[data-lenis-prevent], .asteria-blocknote");
      if (!preventRoot) return;

      let el: HTMLElement | null = target as HTMLElement;
      while (el && el !== preventRoot.parentElement) {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        const canScrollY =
          (overflowY === "auto" || overflowY === "scroll") &&
          el.scrollHeight > el.clientHeight + 1;

        if (canScrollY || el.hasAttribute("data-lenis-prevent")) {
          event.stopImmediatePropagation();
          return;
        }

        if (el === preventRoot) break;
        el = el.parentElement;
      }
    };

    window.addEventListener("wheel", onWheelCapture, { capture: true });

    const lenis = new Lenis({
      duration: 1.1,
      anchors: { offset: -12 },
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const syncLenisWithPopup = () => {
      if (document.body.classList.contains("case-popup-open")) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };
    syncLenisWithPopup();
    const popupObserver = new MutationObserver(syncLenisWithPopup);
    popupObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger in sync after Lenis boots / layout settles
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      popupObserver.disconnect();
      window.removeEventListener("wheel", onWheelCapture, { capture: true } as any);
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return children;
}
