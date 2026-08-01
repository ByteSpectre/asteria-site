import { FEATURED_SERVICE_PAGES, type ServiceNavItem } from "@/lib/services/catalog";
import { listPublishedServices } from "@/lib/server/content-repository";

export async function listServiceNavItems(): Promise<ServiceNavItem[]> {
  try {
    const published = await listPublishedServices();
    const featuredSlugs = new Set(FEATURED_SERVICE_PAGES.map((item) => item.slug));
    const extras = published
      .filter((service) => !featuredSlugs.has(service.slug))
      .map((service) => ({
        title: service.title,
        slug: service.slug,
        category: service.category,
      }));

    // Prefer featured pages first so dedicated layouts stay discoverable
    // even if CMS order differs.
    const featuredFromDb = FEATURED_SERVICE_PAGES.map((featured) => {
      const match = published.find((service) => service.slug === featured.slug);
      return match
        ? {
            title: match.title,
            slug: match.slug,
            category: match.category,
          }
        : featured;
    });

    return [...featuredFromDb, ...extras];
  } catch {
    return FEATURED_SERVICE_PAGES;
  }
}
