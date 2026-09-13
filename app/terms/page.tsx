import LegalDocumentPage, { legalMetadata } from "@/components/LegalDocumentPage";
import { loadLegalDocument } from "@/lib/legal/load-document";

export const metadata = legalMetadata({
  title: "Пользовательское соглашение",
  description:
    "Пользовательское соглашение сайта юридического агентства Астерия.",
});

export default async function TermsPage() {
  const body = await loadLegalDocument("terms.raw.txt");

  return (
    <LegalDocumentPage
      title="Пользовательское соглашение"
      description="Условия и порядок использования сайта https://asteria-law.ru, его функциональных возможностей и контента."
      updatedAt="10 сентября 2026"
      body={body}
    />
  );
}
