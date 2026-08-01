import {
  BANKRUPTCY_META,
  BANKRUPTCY_SLUG,
} from "@/lib/services/bankruptcy";
import {
  SUBSCRIPTION_META,
  SUBSCRIPTION_SLUG,
} from "@/lib/services/subscription";

export type ServiceNavItem = {
  title: string;
  slug: string;
  category: string;
};

/** Canonical public service pages with dedicated layouts. */
export const FEATURED_SERVICE_PAGES: ServiceNavItem[] = [
  {
    slug: BANKRUPTCY_SLUG,
    title: BANKRUPTCY_META.title,
    category: BANKRUPTCY_META.category,
  },
  {
    slug: SUBSCRIPTION_SLUG,
    title: SUBSCRIPTION_META.title,
    category: SUBSCRIPTION_META.category,
  },
];

export function isFeaturedServiceSlug(slug: string) {
  return FEATURED_SERVICE_PAGES.some((item) => item.slug === slug);
}
