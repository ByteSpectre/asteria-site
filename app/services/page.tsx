import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PublicContentIndex } from "@/components/content/PublicContentIndex";
import { formatContentDate } from "@/lib/content";
import { listPublishedServices } from "@/lib/server/content-repository";

export const metadata: Metadata = { title: "Услуги — Астерия", description: "Направления юридической практики агентства Астерия." };
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await listPublishedServices();
  const items = services.map((service) => ({ id: service.id, title: service.title, category: service.category, date: formatContentDate(service.publishedAt ?? service.updatedAt), href: `/services/${service.slug}`, description: service.summary ?? undefined }));

  return (
    <><Header /><main className="min-h-[75svh] bg-cream pt-28 pb-20 md:pt-36 md:pb-28"><div className="container-x mx-auto max-w-[1440px]"><header className="grid gap-6 border-b border-ink/10 pb-10 lg:grid-cols-[1fr_0.7fr] lg:items-end"><div><p className="eyebrow text-wine">Юридическая практика</p><h1 className="mt-5 text-[clamp(3.2rem,7vw,7.5rem)] leading-[0.9] tracking-[-0.075em]">Услуги</h1></div><p className="max-w-[50ch] text-sm leading-relaxed text-ink/48 lg:justify-self-end">Сопровождаем частных клиентов и бизнес в судебных спорах, сделках и сложных правовых ситуациях.</p></header><div className="mt-8"><PublicContentIndex items={items} itemLabel="услуги" emptyLabel="Опубликованных услуг пока нет." /></div></div></main><Footer /></>
  );
}
