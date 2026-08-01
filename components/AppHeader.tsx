import Header from "@/components/Header";
import { listServiceNavItems } from "@/lib/server/service-nav";

export default async function AppHeader() {
  const services = await listServiceNavItems();
  return <Header services={services} />;
}
