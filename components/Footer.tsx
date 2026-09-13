"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CONTACTS } from "@/lib/data";
import { LEGAL_ENTITY, LEGAL_LINKS } from "@/lib/legal";

const FOOTER_DOCS = [
  LEGAL_LINKS.privacy,
  LEGAL_LINKS.terms,
  LEGAL_LINKS.personalData,
  LEGAL_LINKS.marketing,
] as const;

export default function Footer() {
  const year = new Date().getFullYear();
  const [msk, setMsk] = useState("--:--");

  useEffect(() => {
    const tick = () => {
      setMsk(
        new Intl.DateTimeFormat("ru-RU", {
          timeZone: "Europe/Moscow",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="border-t border-ink/10 bg-ivory">
      <div className="container-x mx-auto flex max-w-[1440px] flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between md:py-14">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label="Астерия"
          >
            <Image
              src="/images/logo-a.svg"
              alt=""
              width={24}
              height={30}
              className="h-7 w-auto brightness-0"
            />
          </Link>
          <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-ink/50">
            Юридическое агентство. Защищаем в судах и сделках, сохраняем активы.
          </p>
          <div className="type-body-sm mt-6 max-w-[40ch] space-y-1 text-ink/45">
            <p>{LEGAL_ENTITY.name}</p>
            <p>
              ИНН {LEGAL_ENTITY.inn} · ОГРН {LEGAL_ENTITY.ogrn}
            </p>
            <p>Юр. адрес: {LEGAL_ENTITY.legalAddress}</p>
            <p>Офис: {LEGAL_ENTITY.office}</p>
          </div>
        </div>

        <div className="text-sm text-ink/50 md:text-right">
          <a href={CONTACTS.phoneHref} className="link-underline block">
            {CONTACTS.phone}
          </a>
          <a
            href={`mailto:${LEGAL_ENTITY.email}`}
            className="link-underline mt-2 block"
          >
            {LEGAL_ENTITY.email}
          </a>
          <p className="type-label mt-4 font-mono uppercase text-ink/35">
            Москва · {msk}
          </p>
        </div>
      </div>

      <div className="type-micro container-x mx-auto max-w-[1440px] border-t border-ink/8 py-6">
        <nav
          aria-label="Юридические документы"
          className="flex flex-col gap-3 text-ink/45 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2"
        >
          {FOOTER_DOCS.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="link-underline hover:text-wine"
            >
              {doc.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex flex-col gap-2 text-ink/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Астерия. Все права защищены.</p>
          <p className="font-mono tracking-[0.04em] uppercase">
            Первая консультация бесплатно
          </p>
        </div>
      </div>
    </footer>
  );
}
