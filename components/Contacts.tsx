"use client";

import { useState } from "react";
import Image from "next/image";
import { CONTACTS } from "@/lib/data";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import Arrow from "@/components/Arrow";
import Star from "@/components/Star";
import ContactSky from "@/components/ContactSky";

const MESSENGERS = [
  { label: "Telegram", href: "https://t.me/", icon: "/images/icon-msg-2.svg" },
  {
    label: "WhatsApp",
    href: "https://wa.me/79953013834",
    icon: "/images/icon-msg-3.svg",
  },
  { label: "Max", href: "#", icon: "/images/icon-max.svg" },
];

function CopyRow({
  label,
  value,
  href,
  display,
}: {
  label: string;
  value: string;
  href: string;
  display: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div>
      <dt className="eyebrow flex items-center justify-between gap-3 text-ivory/40">
        <span>{label}</span>
        <button
          type="button"
          onClick={copy}
          className="type-micro cursor-pointer font-mono uppercase text-ivory/50 transition-colors hover:text-ivory"
        >
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </dt>
      <dd className="mt-3">
        <a
          href={href}
          className="link-underline font-display text-[clamp(1.125rem,2.4vw,1.5rem)] tracking-tight whitespace-nowrap"
        >
          {display}
        </a>
      </dd>
    </div>
  );
}

export default function Contacts() {
  return (
    <section id="contacts" className="relative overflow-hidden bg-wine text-ivory">
      <ContactSky />

      <div className="container-x relative z-10 mx-auto max-w-[1440px] py-20 md:py-28 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-2 text-ivory/55">
              <Star className="h-2.5 w-2.5" />
              Контакты
            </p>
            <h2 className="type-section-title-lg font-display max-w-[12ch]">
              Давайте обсудим вашу задачу
            </h2>
            <p className="type-body-sm mt-6 max-w-[36ch] text-ivory/65">
              Свяжитесь удобным способом — ответим на вопрос и предложим подходящий
              формат работы.
            </p>

            <div className="mt-8 inline-flex items-center gap-3 border border-ivory/20 bg-wine/40 px-4 py-3 backdrop-blur-[2px]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-ivory/50" />
                <span className="relative h-2 w-2 rounded-full bg-ivory" />
              </span>
              <span className="type-label font-mono uppercase text-ivory/80">
                Ответим ~15 минут
              </span>
            </div>

            <MagneticButton
              href={CONTACTS.phoneHref}
              className="type-label mt-8 h-12 min-w-[240px] bg-ivory px-7 font-mono uppercase text-ink transition-colors duration-300 hover:bg-cream"
            >
              Позвонить
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="grid gap-8 border-t border-ivory/15 pt-8 sm:grid-cols-2 lg:border-t-0 lg:pt-2">
              <CopyRow
                label="Телефон"
                value="+79953013834"
                href={CONTACTS.phoneHref}
                display={CONTACTS.phone}
              />
              <CopyRow
                label="Email"
                value={CONTACTS.email}
                href={`mailto:${CONTACTS.email}`}
                display={CONTACTS.email}
              />
              <div className="sm:col-span-2">
                <dt className="eyebrow text-ivory/40">Адрес</dt>
                <dd className="type-body-sm mt-3 max-w-[28ch] text-ivory/75">
                  {CONTACTS.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="eyebrow text-ivory/40">Мессенджеры</dt>
                <dd className="mt-4 flex items-center gap-3">
                  {MESSENGERS.map((m) => (
                    <a
                      key={m.label}
                      href={m.href}
                      target={m.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        m.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      aria-label={m.label}
                      className="group relative flex h-12 w-12 cursor-pointer items-center justify-center border border-ivory/20 bg-wine/50 transition-colors duration-300 hover:border-ivory/50 hover:bg-ivory/10"
                    >
                      <Image
                        src={m.icon}
                        alt=""
                        width={22}
                        height={22}
                        className="brightness-0 invert"
                      />
                      <span className="type-micro pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap border border-ivory/20 bg-wine px-2 py-1 font-mono uppercase text-ivory opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        {m.label}
                      </span>
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
