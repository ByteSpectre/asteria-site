"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { COOKIE_DETAILS_TEXT, LEGAL_LINKS } from "@/lib/legal";

const CONSENT_KEY = "asteria_cookie_consent";
const SHOW_DELAY_MS = 3000;

function whenFullyLoaded(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (document.readyState === "complete") return Promise.resolve();

  return new Promise((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let delayId = 0;

    try {
      if (localStorage.getItem(CONSENT_KEY)) return;
    } catch {
      // Storage may be blocked — still show the banner.
    }

    setMounted(true);

    whenFullyLoaded().then(() => {
      if (cancelled) return;
      delayId = window.setTimeout(() => {
        if (!cancelled) setShown(true);
      }, SHOW_DELAY_MS);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(delayId);
    };
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ accepted: true, at: Date.now() }),
      );
    } catch {
      // Storage may be blocked; still hide the banner for this session.
    }
    setShown(false);
  };

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-text"
      aria-hidden={!shown}
      aria-modal="true"
      className={`fixed right-4 bottom-4 z-[95] w-[min(100%-2rem,26rem)] border border-ink/20 bg-white p-5 text-ink shadow-[0_18px_48px_rgba(22,19,16,0.14)] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:right-6 sm:bottom-6 sm:p-6 ${
        shown
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <p id="cookie-consent-title" className="type-label font-mono uppercase text-ink/40">
        Уведомление о cookie
      </p>
      <p id="cookie-consent-text" className="type-body-sm mt-3 text-ink/80">
        На сайте используются cookie-файлы и системы аналитики для улучшения его работы.
        Продолжая использовать наш сайт, Вы соглашаетесь с условиями обработки cookie-файлов (
        <Link href={LEGAL_LINKS.privacy.href} className="link-underline text-ink hover:text-wine">
          {LEGAL_LINKS.privacy.label}
        </Link>
        ) и пользовательских данных с помощью Яндекс.Метрика (
        <Link
          href={LEGAL_LINKS.yandexMetrica.href}
          className="link-underline text-ink hover:text-wine"
        >
          {LEGAL_LINKS.yandexMetrica.shortLabel}
        </Link>
        ), необходимых для аналитики и улучшения качества работы сайта и сервиса.
      </p>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="type-body-sm mt-4 text-left text-ink underline decoration-ink/40 underline-offset-4 transition-colors hover:text-wine hover:decoration-wine"
      >
        Подробнее
      </button>

      {expanded ? (
        <p className="type-body-sm mt-4 text-ink/65">{COOKIE_DETAILS_TEXT}</p>
      ) : null}

      <button
        type="button"
        onClick={accept}
        className="type-label mt-5 flex h-11 w-full items-center justify-center bg-wine font-mono uppercase text-white transition-colors hover:bg-wine-deep"
      >
        Окей
      </button>
    </div>
  );
}
