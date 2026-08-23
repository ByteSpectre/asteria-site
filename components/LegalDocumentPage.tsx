import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

type Props = {
  title: string;
  description: string;
  lead: string;
};

export function legalMetadata({ title, description }: Pick<Props, "title" | "description">): Metadata {
  return { title: `${title} — Астерия`, description };
}

export default function LegalDocumentPage({ title, description, lead }: Props) {
  return (
    <>
      <AppHeader />
      <main className="min-h-[75svh] bg-cream pt-28 pb-20 text-ink md:pt-36 md:pb-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <p className="type-label font-mono uppercase text-ink/40">Документы</p>
          <h1 className="type-section-title font-display mt-4">{title}</h1>
          <p className="type-body mt-8 text-ink/65">{lead}</p>
          <p className="type-body-sm mt-6 text-ink/50">{description}</p>
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
