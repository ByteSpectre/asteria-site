import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";
import { formatContentDate } from "@/lib/content";
import { requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";

export const metadata: Metadata = { title: "Администраторы — Управление Астерия" };

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  const admins = await getDb().adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, login: true, createdAt: true },
  });

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-7 lg:px-10 lg:py-12">
      <AdminPageHeader
        eyebrow="Доступ"
        title="Администраторы"
        description="Управляйте учётными записями панели: добавляйте администраторов, меняйте логины и пароли. После изменения данных сеанс завершается автоматически."
      />
      <AdminUsersManager
        admins={admins.map((admin) => ({
          id: admin.id,
          login: admin.login,
          createdAt: formatContentDate(admin.createdAt),
        }))}
        currentId={session.id}
      />
    </div>
  );
}
