import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Астерия",
  description:
    "Политика конфиденциальности юридического агентства Астерия. Текст страницы будет опубликован позже.",
};

export default function PrivacyPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-[75svh] bg-cream pt-28 pb-20 text-ink md:pt-36 md:pb-28">
        <div className="container-x mx-auto max-w-[720px]">
          <p className="type-label font-mono uppercase text-ink/40">Документы</p>
          <h1 className="type-section-title font-display mt-4">
            Политика конфиденциальности
          </h1>
          <p className="type-body mt-8 text-ink/65">
            Полный текст политики конфиденциальности будет добавлен на эту страницу
            позже. До публикации мы обрабатываем заявки только для связи с вами по
            указанным контактам.
          </p>
          <Link
            href="/"
            className="type-label mt-10 inline-flex h-12 items-center justify-center bg-wine px-7 font-mono uppercase text-ivory transition-colors hover:bg-wine-deep"
          >
            На главную
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
