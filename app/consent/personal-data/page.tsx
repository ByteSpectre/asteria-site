import LegalDocumentPage, { legalMetadata } from "@/components/LegalDocumentPage";

export const metadata = legalMetadata({
  title: "Согласие на обработку персональных данных",
  description: "Согласие на обработку персональных данных юридического агентства Астерия.",
});

export default function PersonalDataConsentPage() {
  return (
    <LegalDocumentPage
      title="Согласие на обработку персональных данных"
      description="Полный текст согласия будет опубликован на этой странице позже."
      lead="Документ определяет условия, на которых пользователь даёт согласие на обработку персональных данных."
    />
  );
}
