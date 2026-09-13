import LegalDocumentPage, { legalMetadata } from "@/components/LegalDocumentPage";
import { loadLegalDocument } from "@/lib/legal/load-document";

export const metadata = legalMetadata({
  title: "Согласие на получение рекламных и новостных рассылок",
  description:
    "Согласие субъекта персональных данных на получение рекламных и новостных материалов.",
});

export default async function MarketingConsentPage() {
  const body = await loadLegalDocument("consent-marketing.raw.txt");

  return (
    <LegalDocumentPage
      title="Согласие на обработку ПДн (реклама)"
      description="Согласие субъекта персональных данных на получение рекламных и новостных материалов об услугах Оператора и его партнёров."
      body={body}
    />
  );
}
