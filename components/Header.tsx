"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/data";
import type { ServiceNavItem } from "@/lib/services/catalog";
import LeadButton from "@/components/contact/LeadButton";

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

export default function Header({ services = [] }: { services?: ServiceNavItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [casePopupOpen, setCasePopupOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const raf = useRef(0);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesMenuId = useId();

  useEffect(() => {
    const sync = () =>
      setCasePopupOpen(document.body.classList.contains("case-popup-open"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    if (!servicesOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!servicesRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false);
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  const light = overDark && !open;
  const otherLinks = NAV_LINKS.filter((link) => link.label !== "Услуги");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,backdrop-filter,border-color,transform,opacity] duration-300 ${
          casePopupOpen
            ? "pointer-events-none -translate-y-full opacity-0"
            : open
              ? "border-b border-ink/8 bg-cream"
              : scrolled
                ? light
                  ? "border-b border-ivory/10 bg-ink/55 backdrop-blur-md"
                  : "border-b border-ink/8 bg-cream/90 backdrop-blur-md"
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
            <div
              ref={servicesRef}
              className="relative flex items-center"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className={`eyebrow link-underline inline-flex h-auto items-center gap-1.5 border-0 bg-transparent p-0 pb-0.5 leading-[1.4] transition-colors duration-300 ${
                  light
                    ? "text-ivory/80 hover:text-ivory"
                    : "text-ink/70 hover:text-ink"
                }`}
                aria-expanded={servicesOpen}
                aria-controls={servicesMenuId}
                aria-haspopup="menu"
                onClick={() => setServicesOpen((value) => !value)}
                onFocus={() => setServicesOpen(true)}
              >
                Услуги
                <span
                  aria-hidden
                  className={`inline-block translate-y-[-0.05em] text-[0.6em] leading-none transition-transform duration-300 ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>

              <div
                id={servicesMenuId}
                role="menu"
                aria-label="Услуги"
                className={`absolute top-full left-0 min-w-[18rem] pt-3 transition-[opacity,visibility,transform] duration-200 ${
                  servicesOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                <div className="border border-ink/10 bg-cream shadow-[0_18px_40px_rgba(22,19,16,0.08)]">
                  {services.length ? (
                    <ul className="py-2">
                      {services.map((service) => (
                        <li key={service.slug} role="none">
                          <Link
                            role="menuitem"
                            href={`/services/${service.slug}`}
                            className="block px-5 py-3 transition-colors hover:bg-cream"
                            onClick={() => setServicesOpen(false)}
                          >
                            <span className="type-body-sm block font-medium text-ink">
                              {service.title}
                            </span>
                            <span className="type-label mt-1 block font-mono uppercase text-ink/35">
                              {service.category}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="type-body-sm px-5 py-4 text-ink/45">Услуги скоро появятся</p>
                  )}
                </div>
              </div>
            </div>

            {otherLinks.map((link) => (
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
            className={`relative z-[110] flex h-11 w-11 cursor-pointer items-center justify-center lg:hidden ${
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
        className={`fixed inset-0 z-[90] bg-cream transition-[opacity,visibility] duration-300 lg:hidden ${
          open
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex h-dvh flex-col justify-between px-6 pt-24 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          <ul className="flex flex-col gap-1 overflow-y-auto">
            <li>
              <button
                type="button"
                className="type-nav-mobile font-display flex w-full items-center justify-between py-2.5 text-left text-ink"
                aria-expanded={mobileServicesOpen}
                onClick={() => setMobileServicesOpen((value) => !value)}
              >
                Услуги
                <span
                  aria-hidden
                  className={`type-label font-mono transition-transform duration-300 ${
                    mobileServicesOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  mobileServicesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <ul className="space-y-1 border-l border-ink/10 pb-3 pl-4">
                    {services.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${service.slug}`}
                          onClick={() => setOpen(false)}
                          className="block py-2"
                        >
                          <span className="type-body-sm block text-ink/80">{service.title}</span>
                          <span className="type-label mt-1 block font-mono uppercase text-ink/35">
                            {service.category}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>

            {otherLinks.map((link) => (
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
            <LeadButton
              showArrow={false}
              onClick={() => setOpen(false)}
              className="type-label h-12 bg-wine px-5 font-mono uppercase text-ivory"
            >
              Консультация
            </LeadButton>
          </div>
        </nav>
      </div>
    </>
  );
}
