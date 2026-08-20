"use client";

import { useEffect, useState, useActionState } from "react";
import Link from "next/link";
import Arrow from "@/components/Arrow";
import {
  formatRuPhoneMask,
  type ContactFormMode,
} from "@/lib/contact-form";
import {
  prepareContactFormAction,
  submitContactLeadAction,
  type ContactLeadState,
} from "@/app/actions/contact";

const initialState: ContactLeadState = { refresh: 0 };

type Props = {
  open: boolean;
  mode: ContactFormMode;
  onClose: () => void;
};

export default function ContactFormModal({ open, mode, onClose }: Props) {
  const [state, formAction, pending] = useActionState(
    submitContactLeadAction,
    initialState,
  );
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [openedAt, setOpenedAt] = useState(0);
  const [nonce, setNonce] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [captchaFresh, setCaptchaFresh] = useState(false);
  const [done, setDone] = useState(false);

  const isService = mode.type === "service";
  const serviceName = isService ? mode.serviceName : "";
  const canSubmit = email.trim().length > 3 && captcha.trim().length > 0 && !pending;

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setEmail("");
    setPhone("");
    setCaptcha("");
    setDone(false);

    void (async () => {
      try {
        const token = await prepareContactFormAction();
        if (!cancelled) {
          setOpenedAt(token.openedAt);
          setNonce(token.nonce);
        }
      } catch {
        if (!cancelled) {
          setOpenedAt(Date.now());
          setNonce("");
        }
      }
      if (!cancelled) setCaptchaKey((value) => value + 1);
    })();

    return () => {
      cancelled = true;
    };
  }, [open, mode]);

  useEffect(() => {
    if (!open) return;
    if (state.ok) setDone(true);
    if (!state.refresh) return;

    setCaptcha("");
    setCaptchaKey((value) => value + 1);

    // The server consumes the form token on every submission attempt,
    // so each retry needs a freshly issued token.
    let cancelled = false;
    void (async () => {
      try {
        const token = await prepareContactFormAction();
        if (!cancelled) {
          setOpenedAt(token.openedAt);
          setNonce(token.nonce);
        }
      } catch {
        // Submit will surface the server error if re-issue failed.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [state, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const show = window.setTimeout(() => setVisible(true), 20);
      return () => window.clearTimeout(show);
    }
    setVisible(false);
    const hide = window.setTimeout(() => setMounted(false), 400);
    return () => window.clearTimeout(hide);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;

    const scrollbarWidth = Math.max(
      0,
      window.innerWidth - document.documentElement.clientWidth,
    );
    const previous = {
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
      bodyPaddingRight: document.body.style.paddingRight,
      compensation: document.documentElement.style.getPropertyValue(
        "--scrollbar-compensation",
      ),
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      const pad = `${scrollbarWidth}px`;
      document.body.style.paddingRight = pad;
      document.documentElement.style.setProperty("--scrollbar-compensation", pad);
    }
    document.body.classList.add("contact-form-open");

    return () => {
      document.documentElement.style.overflow = previous.htmlOverflow;
      document.body.style.overflow = previous.bodyOverflow;
      document.body.style.paddingRight = previous.bodyPaddingRight;
      if (previous.compensation) {
        document.documentElement.style.setProperty(
          "--scrollbar-compensation",
          previous.compensation,
        );
      } else {
        document.documentElement.style.removeProperty("--scrollbar-compensation");
      }
      document.body.classList.remove("contact-form-open");
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Закрыть"
        className={`absolute inset-0 bg-ink/85 backdrop-blur-[4px] transition-opacity duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-form-title"
        data-lenis-prevent
        className={`relative z-10 w-full max-w-lg border border-ink/10 bg-ivory text-ink shadow-[0_24px_80px_rgba(22,19,16,0.45)] transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none sm:mx-6 ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0 sm:translate-y-5"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4 sm:px-7">
          <div>
            <p className="type-label font-mono uppercase text-ink/40">Заявка</p>
            <h2
              id="contact-form-title"
              className="type-card-title font-display mt-2 font-medium"
            >
              {isService ? "Заказ услуги" : "Консультация"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="type-label h-10 cursor-pointer px-2 font-mono uppercase text-ink/45 transition-colors hover:text-wine"
          >
            Закрыть ✕
          </button>
        </div>

        {done ? (
          <div className="px-5 py-10 sm:px-7">
            <p className="type-feature-name font-display font-medium">Заявка отправлена</p>
            <p className="type-body-sm mt-4 max-w-[36ch] text-ink/60">
              Мы получили ваши данные и свяжемся с вами в ближайшее время.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="type-label mt-8 inline-flex h-12 items-center justify-center bg-wine px-7 font-mono uppercase text-ivory transition-colors hover:bg-wine-deep"
            >
              Хорошо
            </button>
          </div>
        ) : (
          <form action={formAction} className="px-5 py-6 sm:px-7 sm:py-8" autoComplete="on">
            <input type="hidden" name="mode" value={isService ? "service" : "consultation"} />
            <input type="hidden" name="openedAt" value={openedAt || ""} />
            <input type="hidden" name="nonce" value={nonce} />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
            >
              <label>
                Company website
                <input
                  type="text"
                  name="companyWebsite"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                />
              </label>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="type-label font-mono uppercase text-ink/45">
                  Почта <span className="text-wine">*</span>
                </span>
                <input
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  spellCheck={false}
                  value={email}
                  onChange={(event) => setEmail(event.target.value.slice(0, 254))}
                  className="mt-2 h-12 w-full border border-ink/15 bg-transparent px-4 type-body-sm outline-none transition-colors focus:border-ink/40"
                  placeholder="name@example.com"
                />
              </label>

              <label className="block">
                <span className="type-label font-mono uppercase text-ink/45">Телефон</span>
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={18}
                  spellCheck={false}
                  value={phone}
                  onChange={(event) => setPhone(formatRuPhoneMask(event.target.value))}
                  className="mt-2 h-12 w-full border border-ink/15 bg-transparent px-4 type-body-sm outline-none transition-colors focus:border-ink/40"
                  placeholder="+7 (999) 123-45-67"
                />
              </label>

              {isService ? (
                <label className="block">
                  <span className="type-label font-mono uppercase text-ink/45">
                    Название услуги
                  </span>
                  <input
                    name="serviceName"
                    type="text"
                    readOnly
                    aria-readonly="true"
                    tabIndex={-1}
                    value={serviceName}
                    maxLength={200}
                    className="mt-2 h-12 w-full cursor-default border border-ink/10 bg-cream/60 px-4 type-body-sm text-ink/70 outline-none select-none"
                  />
                </label>
              ) : null}

              <div>
                <span className="type-label font-mono uppercase text-ink/45">
                  Проверочный код <span className="text-wine">*</span>
                </span>
                <div className="mt-2 flex flex-wrap items-stretch gap-3">
                  <input
                    name="captcha"
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    required
                    maxLength={5}
                    spellCheck={false}
                    value={captcha}
                    onChange={(event) =>
                      setCaptcha(
                        event.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, "")
                          .slice(0, 5),
                      )
                    }
                    aria-label="Код с изображения"
                    className="h-16 min-w-0 flex-1 border border-ink/15 bg-transparent px-4 text-center text-lg uppercase tracking-[0.18em] outline-none focus:border-ink/40"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={captchaKey}
                    src={`/api/contact-captcha?v=${captchaKey}${captchaFresh ? "&fresh=1" : ""}`}
                    alt="Проверочный код"
                    width={190}
                    height={64}
                    className="h-16 w-[190px] border border-ink/10 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCaptcha("");
                      setCaptchaFresh(true);
                      setCaptchaKey((value) => value + 1);
                    }}
                    className="type-label h-16 shrink-0 border border-ink/15 px-4 font-mono uppercase text-ink/50 transition-colors hover:border-ink/35 hover:text-ink"
                  >
                    Обновить
                  </button>
                </div>
              </div>
            </div>

            {state.error ? (
              <p role="alert" className="type-body-sm mt-5 border-l-2 border-wine pl-4 text-wine">
                {state.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className="type-label mt-8 inline-flex h-12 w-full items-center justify-center gap-3 bg-wine px-6 font-mono uppercase text-ivory transition-colors hover:bg-wine-deep disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ivory/70 sm:w-auto"
            >
              {pending
                ? "Отправка…"
                : isService
                  ? "Заказать услугу"
                  : "Заказать консультацию"}
              {!pending ? <Arrow className="h-4 w-4" /> : null}
            </button>

            <p className="type-body-sm mt-5 max-w-[42ch] text-ink/45">
              Отправляя данные, вы соглашаетесь с{" "}
              <Link
                href="/privacy"
                className="text-ink/70 underline underline-offset-4 transition-colors hover:text-wine"
              >
                политикой конфиденциальности
              </Link>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
