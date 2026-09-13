import LegalDocumentPage, { legalMetadata } from "@/components/LegalDocumentPage";
import { loadLegalDocument } from "@/lib/legal/load-document";

export const metadata = legalMetadata({
  title: "Согласие на обработку персональных данных",
  description: "Согласие субъекта персональных данных на обработку ПДн.",
});

export default async function PersonalDataConsentPage() {
  const body = await loadLegalDocument("consent-personal-data.raw.txt");

  return (
    <LegalDocumentPage
      title="Согласие на обработку персональных данных"
      description="Согласие субъекта персональных данных на обработку персональных данных при заполнении форм на сайте."
      body={body}
    />
  );
}
