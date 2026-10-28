import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Arrow from "@/components/Arrow";
import Footer from "@/components/Footer";
import Star from "@/components/Star";
import LeadButton from "@/components/contact/LeadButton";

export const metadata: Metadata = {
  title: "Страница не найдена — Астерия",
  description:
    "Страница не найдена. Вернитесь на главную или выберите нужный раздел сайта — услуги, база знаний и контакты.",
};

const USEFUL_LINKS = [
  {
    href: "/#services",
    title: "Услуги агентства",
    description: "Суды, сделки, банкротство и защита активов.",
  },
  {
    href: "/knowledge",
    title: "База знаний",
    description: "Разборы практики и ответы юристов.",
  },
  {
    href: "/#contacts",
    title: "Контакты",
    description: "Телефон, почта и мессенджеры команды.",
  },
] as const;

export default function NotFound() {
  return (
    <>
      <AppHeader />
      <main className="min-h-svh bg-cream pt-28 text-ink md:pt-36">
        <div className="container-x mx-auto max-w-[1440px] pb-16 md:pb-24">
          <section
            aria-labelledby="not-found-title"
            className="grid gap-10 border-b border-ink/10 pb-12 sm:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16 lg:pb-20"
          >
            <div>
              <p className="eyebrow flex items-center gap-2 text-wine">
                <Star className="h-2.5 w-2.5" />
                Ошибка 404
              </p>
              <p
                aria-hidden="true"
                className="font-display mt-6 text-[clamp(6.5rem,20vw,16rem)] leading-[0.78] tracking-[-0.09em] text-wine"
              >
                404
              </p>
              <h1
                id="not-found-title"
                className="type-section-title font-display mt-7 max-w-[16ch]"
              >
                Страница не найдена
              </h1>
            </div>

            <div className="lg:pb-2">
              <p className="type-body-lg max-w-[46ch] text-ink/60">
                Возможно, ссылка устарела или страница была перемещена. Вернитесь на
                главную — или выберите нужный раздел ниже.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="group type-label inline-flex h-12 items-center justify-center gap-3 bg-wine px-7 font-mono uppercase text-ivory transition-colors hover:bg-wine-deep"
                >
                  На главную
                  <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/knowledge"
                  className="type-label inline-flex h-12 items-center justify-center border border-ink/15 px-7 font-mono uppercase text-ink/70 transition-colors hover:border-ink/35 hover:text-ink"
                >
                  База знаний
                </Link>
              </div>
            </div>
          </section>

          <nav
            aria-label="Полезные разделы"
            className="mt-10 grid gap-px border border-ink/10 bg-ink/10 sm:mt-12 sm:grid-cols-3"
          >
            {USEFUL_LINKS.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col gap-10 bg-cream px-6 py-7 transition-colors duration-300 hover:bg-ivory"
              >
                <span className="type-label font-mono uppercase text-ink/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="type-feature-name font-display block">
                    {link.title}
                  </span>
                  <span className="type-body-sm mt-2 block max-w-[30ch] text-ink/50">
                    {link.description}
                  </span>
                </span>
                <Arrow className="h-5 w-5 text-ink/30 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-wine" />
              </Link>
            ))}
          </nav>
        </div>

        <section className="bg-wine text-ivory">
          <div className="container-x mx-auto flex max-w-[1440px] flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-16">
            <div>
              <p className="eyebrow flex items-center gap-2 text-ivory/55">
                <Star className="h-2.5 w-2.5" />
                Нужна помощь?
              </p>
              <h2 className="type-section-title font-display mt-4 max-w-[20ch]">
                Не нашли нужную информацию?
              </h2>
              <p className="type-body-sm mt-4 max-w-[44ch] text-ivory/65">
                Задайте вопрос — юрист агентства ответит и подскажет, с чего начать.
              </p>
            </div>
            <LeadButton className="type-label h-12 shrink-0 bg-ivory px-7 font-mono uppercase text-ink transition-colors hover:bg-cream">
              Задать вопрос
            </LeadButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
