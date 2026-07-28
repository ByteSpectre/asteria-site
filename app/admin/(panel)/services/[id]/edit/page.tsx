import type { Metadata } from "next";
import { ServiceEditorForm } from "@/components/admin/ServiceEditorForm";
import { getServiceForAdmin } from "@/lib/server/content-repository";

export const metadata: Metadata = { title: "Редактирование услуги — Управление Астерия" };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServiceForAdmin(id);

  return (
    <ServiceEditorForm
      service={{
        id: service.id,
        title: service.title,
        category: service.category,
        summary: service.summary ?? "",
        pricing: service.pricing,
        scopeItems: service.scopeItems,
        faqItems: service.faqItems,
        cases: service.cases,
        published: service.status === "PUBLISHED",
      }}
    />
  );
}
