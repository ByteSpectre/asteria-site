import LegalDocumentPage, { legalMetadata } from "@/components/LegalDocumentPage";

export const metadata = legalMetadata({
  title: "Согласие на получение информационно-рекламных сообщений",
  description:
    "Согласие на получение информационно-рекламных сообщений от юридического агентства Астерия.",
});

export default function MarketingConsentPage() {
  return (
    <LegalDocumentPage
      title="Согласие на получение информационно-рекламных сообщений"
      description="Полный текст согласия будет опубликован на этой странице позже."
      lead="Документ определяет условия получения информационных и рекламных сообщений от «Астерии»."
    />
  );
}
