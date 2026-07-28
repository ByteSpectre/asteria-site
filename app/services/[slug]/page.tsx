import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ServiceTemplate } from "@/components/services/ServiceTemplate";
import {
  normalizeServiceCases,
  normalizeServicePricing,
  normalizeServiceQa,
} from "@/lib/service-content";
import { getPublishedService } from "@/lib/server/content-repository";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublishedService(slug);
  return {
    title: `${service.title} — Астерия`,
    description: service.summary ?? undefined,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getPublishedService(slug);

  return (
    <>
      <Header />
      <main className="bg-ivory pt-16 md:pt-20">
        <ServiceTemplate
          title={service.title}
          category={service.category}
          summary={service.summary ?? ""}
          pricing={normalizeServicePricing(service.pricing)}
          scopeItems={normalizeServiceQa(service.scopeItems)}
          faqItems={normalizeServiceQa(service.faqItems)}
          cases={normalizeServiceCases(service.cases)}
        />
      </main>
      <Footer />
    </>
  );
}
