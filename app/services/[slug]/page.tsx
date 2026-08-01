import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import BankruptcyTurnkeyPage from "@/components/services/BankruptcyTurnkeyPage";
import { ServiceTemplate } from "@/components/services/ServiceTemplate";
import SubscriptionServicePage from "@/components/services/SubscriptionServicePage";
import {
  BANKRUPTCY_META,
  BANKRUPTCY_SLUG,
} from "@/lib/services/bankruptcy";
import {
  SUBSCRIPTION_META,
  SUBSCRIPTION_SLUG,
} from "@/lib/services/subscription";
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

  if (slug === BANKRUPTCY_SLUG) {
    return {
      title: `${BANKRUPTCY_META.title} — Астерия`,
      description: BANKRUPTCY_META.description,
    };
  }

  if (slug === SUBSCRIPTION_SLUG) {
    return {
      title: `${SUBSCRIPTION_META.title} — Астерия`,
      description: SUBSCRIPTION_META.description,
    };
  }

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

  if (slug === BANKRUPTCY_SLUG) {
    return (
      <>
        <AppHeader />
        <main className="bg-cream pt-16 md:pt-20">
          <BankruptcyTurnkeyPage />
        </main>
        <Footer />
      </>
    );
  }

  if (slug === SUBSCRIPTION_SLUG) {
    return (
      <>
        <AppHeader />
        <main className="bg-cream pt-16 md:pt-20">
          <SubscriptionServicePage />
        </main>
        <Footer />
      </>
    );
  }

  const service = await getPublishedService(slug);

  return (
    <>
      <AppHeader />
      <main className="bg-cream pt-16 md:pt-20">
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
