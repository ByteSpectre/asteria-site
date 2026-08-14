import { connection } from "next/server";
import Header from "@/components/Header";
import { listServiceNavItems } from "@/lib/server/service-nav";

export default async function AppHeader() {
  // Keep service nav fresh on every request (homepage must not freeze CMS list at build).
  await connection();
  const services = await listServiceNavItems();
  return <Header services={services} />;
}
