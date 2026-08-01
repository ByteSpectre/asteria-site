import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import {
  BANKRUPTCY_META,
  BANKRUPTCY_SLUG,
} from "../lib/services/bankruptcy";
import {
  SUBSCRIPTION_META,
  SUBSCRIPTION_SLUG,
} from "../lib/services/subscription";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL не задан");
}

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const SERVICES = [
  {
    slug: BANKRUPTCY_SLUG,
    title: BANKRUPTCY_META.title,
    category: BANKRUPTCY_META.category,
    summary: BANKRUPTCY_META.summary,
    sortOrder: 10,
  },
  {
    slug: SUBSCRIPTION_SLUG,
    title: SUBSCRIPTION_META.title,
    category: SUBSCRIPTION_META.category,
    summary: SUBSCRIPTION_META.summary,
    sortOrder: 20,
  },
] as const;

async function main() {
  for (const service of SERVICES) {
    await db.service.upsert({
      where: { slug: service.slug },
      create: {
        slug: service.slug,
        title: service.title,
        category: service.category,
        summary: service.summary,
        sortOrder: service.sortOrder,
        status: "PUBLISHED",
        publishedAt: new Date(),
        pricing: [],
        scopeItems: [],
        faqItems: [],
        cases: [],
      },
      update: {
        title: service.title,
        category: service.category,
        summary: service.summary,
        sortOrder: service.sortOrder,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log(`Upserted service: ${service.slug}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
