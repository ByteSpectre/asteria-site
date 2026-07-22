"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/data";

function SocialIcons({
  light = false,
  className = "",
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 md:gap-4 ${className}`}>
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target={social.href.startsWith("http") ? "_blank" : undefined}
          rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={social.label}
          className="inline-flex shrink-0 transition-opacity duration-300 hover:opacity-70"
        >
          <Image
            src={social.icon}
            alt=""
            width={24}
            height={24}
            className={`h-6 w-6 ${light ? "brightness-0 invert" : "brightness-0"}`}
          />
        </a>
      ))}
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const measure = () => {
      setScrolled(window.scrollY > 24);
      const hero = document.getElementById("hero");
      if (!hero) {
        setOverDark(false);
        return;
      }
      setOverDark(hero.getBoundingClientRect().bottom > 80);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const light = overDark && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,backdrop-filter,border-color] duration-300 ${
          open
            ? "border-b border-ink/8 bg-ivory"
            : scrolled
              ? light
                ? "border-b border-ivory/10 bg-ink/55 backdrop-blur-md"
                : "border-b border-ink/8 bg-ivory/90 backdrop-blur-md"
              : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-x relative z-[2] mx-auto flex h-16 max-w-[1440px] items-center justify-between md:h-20">
          <Link
            href="/"
            className="flex items-center"
            aria-label="Астерия — на главную"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/images/logo-a.svg"
              alt=""
              width={28}
              height={34}
              className={`h-8 w-auto transition-all duration-300 ${
                light ? "" : "brightness-0"
              }`}
              priority
            />
          </Link>

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Основная"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`eyebrow link-underline pb-0.5 transition-colors duration-300 ${
                  light
                    ? "text-ivory/80 hover:text-ivory"
                    : "text-ink/70 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <SocialIcons light={light} className="hidden lg:flex" />

          <button
            type="button"
            className={`relative flex h-11 w-11 cursor-pointer items-center justify-center lg:hidden ${
              light ? "text-ivory" : "text-ink"
            }`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-[14px] w-5" aria-hidden="true">
              <span
                className={`absolute top-0 left-0 h-px w-full origin-center bg-current transition-transform duration-300 ease-out ${
                  open ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute top-[6.5px] left-0 h-px w-full bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full origin-center bg-current transition-transform duration-300 ease-out ${
                  open ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Мобильное меню"
        aria-hidden={!open}
        className={`fixed inset-0 z-[90] bg-ivory transition-[opacity,visibility] duration-300 lg:hidden ${
          open
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex h-dvh flex-col justify-between px-6 pt-24 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          <ul className="flex flex-col gap-1 overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="type-nav-mobile font-display block py-2.5 text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="shrink-0 space-y-5 border-t border-ink/10 pt-6">
            <div className="space-y-3">
              <p className="eyebrow text-ink/40">Мессенджеры</p>
              <SocialIcons />
            </div>
            <a
              href="#contacts"
              onClick={() => setOpen(false)}
              className="type-label inline-flex h-12 cursor-pointer items-center justify-center bg-wine px-5 font-mono uppercase text-ivory"
            >
              Консультация
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
