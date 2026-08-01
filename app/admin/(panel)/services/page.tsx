import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ContentTable } from "@/components/admin/ContentTable";
import { formatContentDate } from "@/lib/content";
import { listAdminServices } from "@/lib/server/content-repository";

export const metadata: Metadata = { title: "Услуги — Управление Астерия" };

export default async function AdminServicesPage() {
  const services = await listAdminServices();
  const rows = services.map((service) => ({
    id: service.id,
    title: service.title,
    category: service.category,
    date: formatContentDate(service.updatedAt),
    status: service.status,
    editHref: `/admin/services/${service.id}/edit`,
    publicHref: `/services/${service.slug}`,
  }));

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-7 lg:px-10 lg:py-12">
      <AdminPageHeader eyebrow="Каталог практик" title="Услуги" description="Управляйте направлениями юридической практики, которые отображаются на сайте." />
      <ContentTable kind="service" rows={rows} addHref="/admin/services/new" emptyTitle="Услуг пока нет" />
    </div>
  );
}
