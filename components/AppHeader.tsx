import { unstable_cache } from "next/cache";
import Header from "@/components/Header";
import { listServiceNavItems } from "@/lib/server/service-nav";

const getCachedServiceNav = unstable_cache(
  async () => listServiceNavItems(),
  ["service-nav-items"],
  { revalidate: 120, tags: ["service-nav"] },
);

export default async function AppHeader() {
  const services = await getCachedServiceNav();
  return <Header services={services} />;
}
