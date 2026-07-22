import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "База знаний — Астерия",
  description: "Материалы юридической практики агентства Астерия. Раздел в подготовке.",
};

export default function KnowledgePage() {
  return (
    <>
      <Header />
      <main className="min-h-[70svh] bg-ivory pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container-x mx-auto max-w-[800px]">
          <p className="eyebrow text-wine">База знаний</p>
          <h1 className="type-section-title-lg font-display mt-5 font-semibold">
            Раздел в подготовке
          </h1>
          <p className="type-body-lg mt-6 max-w-[42ch] text-ink/65">
            Здесь появятся статьи, разборы практики и ответы на частые вопросы.
            Пока можно записаться на консультацию — разберём вашу задачу лично.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/#contacts"
              className="type-label inline-flex h-12 items-center bg-wine px-6 font-mono uppercase text-ivory transition-colors duration-300 hover:bg-wine-deep"
            >
              Консультация
            </Link>
            <Link
              href="/"
              className="type-label inline-flex h-12 items-center border border-ink/15 px-6 font-mono uppercase text-ink transition-colors duration-300 hover:border-ink/40"
            >
              На главную
            </Link>
          </div>

          <div className="mt-16 flex items-center gap-3 border-t border-ink/10 pt-8 text-ink/40">
            <Image
              src="/images/logo-a.svg"
              alt=""
              width={20}
              height={24}
              className="brightness-0 opacity-40"
            />
            <span className="type-label font-mono uppercase">
              Скоро · Астерия
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
