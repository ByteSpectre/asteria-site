"use client";

import { useEffect, useRef } from "react";

type PointerMode = "default" | "interactive" | "pressed";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mode: PointerMode = "default";
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let rafId = 0;

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
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;

      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      setMode(isInteractive(e.target) ? "interactive" : "default");
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

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} data-mode="default" className="custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </>
  );
}
