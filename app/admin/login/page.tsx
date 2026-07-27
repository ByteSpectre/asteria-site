import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Вход в управление — Астерия" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin/knowledge");

  return (
    <main className="grid min-h-screen bg-ivory lg:grid-cols-[minmax(360px,0.8fr)_minmax(560px,1.2fr)]">
      <section className="relative hidden overflow-hidden bg-wine-deep p-10 text-ivory lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_72%_18%,#fbf8f1_0,transparent_23%),linear-gradient(125deg,transparent_48%,rgba(251,248,241,.12)_49%,transparent_50%)]" />
        <Link href="/" className="relative flex items-center gap-4" aria-label="Астерия — на главную">
          <Image src="/images/logo-a.svg" alt="" width={25} height={31} className="h-8 w-auto" />
          <span className="text-xl tracking-[-0.045em]">Астерия</span>
        </Link>
        <div className="relative max-w-[460px]">
          <p className="text-[10px] uppercase tracking-[0.12em] text-ivory/45">Внутренняя система</p>
          <p className="mt-5 text-[clamp(2.5rem,4.5vw,5rem)] leading-[0.92] tracking-[-0.065em]">Управление знаниями и услугами агентства</p>
        </div>
        <p className="relative text-[10px] uppercase tracking-[0.09em] text-ivory/32">Защищённая область · Астерия</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[470px]">
          <Link href="/" className="mb-16 flex items-center gap-3 lg:hidden">
            <Image src="/images/logo-a.svg" alt="" width={22} height={27} className="h-7 w-auto brightness-0" />
            <span className="text-lg tracking-[-0.04em]">Астерия</span>
          </Link>
          <p className="text-[10px] uppercase tracking-[0.11em] text-wine">Панель управления</p>
          <h1 className="mt-4 text-[clamp(3.5rem,8vw,6.5rem)] leading-none tracking-[-0.075em]">Вход</h1>
          <p className="mt-5 max-w-[42ch] text-sm leading-relaxed text-ink/48">Введите данные администратора и код с изображения.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
