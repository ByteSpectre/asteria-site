"use client";

import { useEffect, useRef, useState } from "react";

type PointerMode = "default" | "interactive" | "pressed";

function canUseCustomCursor() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setEnabled(canUseCustomCursor());
    sync();

    const hoverMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    hoverMq.addEventListener("change", sync);
    motionMq.addEventListener("change", sync);

    return () => {
      hoverMq.removeEventListener("change", sync);
      motionMq.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mode: PointerMode = "default";
    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let rafId = 0;
    let running = false;
    let scrolling = false;
    let scrollStopTimer = 0;

    const setMode = (next: PointerMode) => {
      mode = next;
      ring.dataset.mode = next;
    };

    const isInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          "a,button,[role='button'],input,textarea,select,label,summary,[data-cursor='interactive']",
        ),
      );
    };

    const tick = () => {
      if (scrolling) {
        running = false;
        return;
      }

      rx += (x - rx) * 0.22;
      ry += (y - ry) * 0.22;

      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

      if (Math.abs(x - rx) < 0.15 && Math.abs(y - ry) < 0.15) {
        running = false;
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    const startTick = () => {
      if (running || scrolling) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      setMode(isInteractive(e.target) ? "interactive" : "default");
      startTick();
    };

    const onDown = () => setMode("pressed");
    const onUp = (e: MouseEvent) =>
      setMode(isInteractive(e.target) ? "interactive" : "default");
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const onScroll = () => {
      scrolling = true;
      cancelAnimationFrame(rafId);
      running = false;
      window.clearTimeout(scrollStopTimer);
      scrollStopTimer = window.setTimeout(() => {
        scrolling = false;
        startTick();
      }, 120);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(scrollStopTimer);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("scroll", onScroll);
      root.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        data-mode="default"
        className="custom-cursor-ring"
        aria-hidden="true"
      />
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
    </>
  );
}
