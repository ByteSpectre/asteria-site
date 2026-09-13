import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { renderLegalDocument } from "@/lib/legal/parse-document";

type Props = {
  title: string;
  description: string;
  body: string;
  updatedAt?: string;
};

export function legalMetadata({
  title,
  description,
}: Pick<Props, "title" | "description">): Metadata {
  return { title: `${title} — Астерия`, description };
}

export default function LegalDocumentPage({
  title,
  description,
  body,
  updatedAt,
}: Props) {
  return (
    <>
      <AppHeader />
      <main className="min-h-[75svh] bg-cream pt-28 pb-20 text-ink md:pt-36 md:pb-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <div>
            <p className="type-label font-mono uppercase text-ink/40">Документы</p>
            <h1 className="type-section-title font-display mt-4 max-w-[18ch]">{title}</h1>
            {updatedAt ? (
              <p className="type-label mt-6 font-mono uppercase text-ink/40">
                Обновлено · {updatedAt}
              </p>
            ) : null}
            <p className="type-body mt-6 text-ink/55">{description}</p>

            <article className="mt-10 border-t border-ink/10 pt-2">
              {renderLegalDocument(body)}
            </article>

            <Link
              href="/"
              className="type-label mt-14 inline-flex h-12 items-center justify-center bg-wine px-7 font-mono uppercase text-ivory transition-colors hover:bg-wine-deep"
            >
              На главную
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
