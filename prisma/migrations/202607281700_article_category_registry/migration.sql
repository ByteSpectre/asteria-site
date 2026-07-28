CREATE TABLE "ArticleCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ArticleCategory_name_key" ON "ArticleCategory"("name");

INSERT INTO "ArticleCategory" ("id", "name")
SELECT 'cat_' || md5(category_name), category_name
FROM (
    SELECT DISTINCT TRIM("category") AS category_name
    FROM "Article"
) t
WHERE category_name IS NOT NULL
  AND category_name <> '';
