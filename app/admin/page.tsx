import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  redirect(session ? "/admin/knowledge" : "/admin/login");
}
