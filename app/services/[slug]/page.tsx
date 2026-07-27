import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPublishedService } from "@/lib/server/content-repository";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublishedService(slug);
  return { title: `${service.title} — Астерия`, description: service.summary ?? undefined };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getPublishedService(slug);
  return (
    <><Header /><main className="min-h-[75svh] bg-ivory pt-28 pb-20 md:pt-36 md:pb-28"><article className="container-x mx-auto max-w-[1440px]"><Link href="/services" className="text-[10px] uppercase tracking-[0.08em] text-ink/42 hover:text-wine">← Все услуги</Link><div className="mt-10 grid gap-10 border-b border-ink/10 pb-12 lg:grid-cols-[1fr_0.65fr] lg:items-end"><div><p className="eyebrow text-wine">{service.category}</p><h1 className="mt-5 text-[clamp(3rem,7vw,7rem)] leading-[0.92] tracking-[-0.075em]">{service.title}</h1></div>{service.summary ? <p className="text-lg leading-relaxed text-ink/55">{service.summary}</p> : null}</div><div className="mt-10 flex flex-col items-start gap-5 bg-wine-deep p-7 text-ivory sm:p-10"><p className="text-[10px] uppercase tracking-[0.09em] text-ivory/42">Обсудить задачу</p><p className="max-w-[42ch] text-2xl leading-tight tracking-[-0.04em]">Расскажите о ситуации — оценим перспективы и предложим план работы.</p><Link href="/#contacts" className="mt-2 inline-flex h-12 items-center bg-ivory px-6 text-[10px] uppercase tracking-[0.07em] text-wine-deep">Записаться на консультацию →</Link></div></article></main><Footer /></>
  );
}
