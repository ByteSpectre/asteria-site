import LegalDocumentPage, { legalMetadata } from "@/components/LegalDocumentPage";

export const metadata = legalMetadata({
  title: "Политика конфиденциальности и обработки персональных данных",
  description:
    "Политика конфиденциальности и обработки персональных данных юридического агентства Астерия.",
});

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      title="Политика конфиденциальности и обработки персональных данных"
      description="Полный текст документа будет опубликован на этой странице позже."
      lead="Документ описывает порядок обработки персональных данных посетителей сайта и клиентов юридического агентства «Астерия»."
    />
  );
}
