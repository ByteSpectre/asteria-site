import LegalDocumentPage, { legalMetadata } from "@/components/LegalDocumentPage";

export const metadata = legalMetadata({
  title: "Согласие на обработку данных «Яндекс.Метрика»",
  description:
    "Согласие на передачу и обработку персональных данных с помощью сервиса «Яндекс.Метрика».",
});

export default function YandexMetricaConsentPage() {
  return (
    <LegalDocumentPage
      title="Согласие на передачу и обработку персональных данных с помощью сервиса «Яндекс.Метрика»"
      description="Полный текст согласия будет опубликован на этой странице позже."
      lead="Документ описывает условия использования сервиса «Яндекс.Метрика» для аналитики и улучшения работы сайта."
    />
  );
}
