import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { requireAdmin } from "@/lib/server/auth";

export default async function AdminPanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-cream text-ink lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="border-b border-ivory/10 bg-wine-deep text-ivory lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex h-18 items-center justify-between border-b border-ivory/10 px-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Астерия — на сайт">
            <Image src="/images/logo-a.svg" alt="" width={19} height={24} className="h-6 w-auto" />
            <span className="text-base tracking-[-0.04em]">Астерия</span>
          </Link>
          <span className="border border-ivory/18 px-2 py-1 text-[8px] uppercase tracking-[0.1em] text-ivory/45">Admin</span>
        </div>
        <div className="lg:flex-1"><AdminNavigation /></div>
        <div className="flex items-center justify-between border-t border-ivory/10 p-4">
          <div className="min-w-0">
            <p className="truncate text-[11px] text-ivory/70">{session.login}</p>
            <p className="mt-0.5 text-[8px] uppercase tracking-[0.1em] text-ivory/28">Администратор</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" aria-label="Выйти" className="flex h-9 w-9 items-center justify-center border border-ivory/10 text-ivory/45 transition-colors hover:border-ivory/35 hover:text-ivory">
              <LogOut size={15} strokeWidth={1.4} />
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
