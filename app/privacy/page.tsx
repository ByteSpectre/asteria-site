import LegalDocumentPage, { legalMetadata } from "@/components/LegalDocumentPage";
import { loadLegalDocument } from "@/lib/legal/load-document";

export const metadata = legalMetadata({
  title: "Политика обработки персональных данных",
  description:
    "Политика обработки персональных данных юридического агентства Астерия.",
});

export default async function PrivacyPage() {
  const body = await loadLegalDocument("privacy.raw.txt");

  return (
    <LegalDocumentPage
      title="Политика обработки персональных данных"
      description="Порядок обработки и меры по обеспечению безопасности персональных данных пользователей сайта и клиентов юридического агентства «Астерия»."
      updatedAt="10 сентября 2026"
      body={body}
    />
  );
}
