import type { Metadata } from "next";
import { ServiceEditorForm } from "@/components/admin/ServiceEditorForm";

export const metadata: Metadata = { title: "Новая услуга — Управление Астерия" };

export default function NewServicePage() {
  return <ServiceEditorForm />;
}
