import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

let database: PrismaClient | null = null;

export function getDb() {
  if (database) return database;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL не задан. Добавьте строку подключения PostgreSQL в окружение.");
  }

  database = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return database;
}
