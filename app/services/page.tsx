import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AnimatedPageHeader } from "@/components/content/AnimatedPageHeader";
import { PublicContentIndex } from "@/components/content/PublicContentIndex";
import { formatContentDate } from "@/lib/content";
import { listPublishedServices } from "@/lib/server/content-repository";

export const metadata: Metadata = {
  title: "Услуги — Астерия",
  description: "Направления юридической практики агентства Астерия.",
};
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await listPublishedServices();
  const items = services.map((service) => ({
    id: service.id,
    title: service.title,
    category: service.category,
    date: formatContentDate(service.publishedAt ?? service.updatedAt),
    href: `/services/${service.slug}`,
    description: service.summary ?? undefined,
  }));

  return (
    <>
      <Header />
      <main className="min-h-[75svh] bg-cream pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container-x mx-auto max-w-[1440px]">
          <AnimatedPageHeader
            eyebrow="Юридическая практика"
            title="Услуги"
            description="Сопровождаем частных клиентов и бизнес в судебных спорах, сделках и сложных правовых ситуациях."
          />
          <div className="mt-8">
            <PublicContentIndex
              items={items}
              itemLabel="услуги"
              emptyLabel="Опубликованных услуг пока нет."
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
