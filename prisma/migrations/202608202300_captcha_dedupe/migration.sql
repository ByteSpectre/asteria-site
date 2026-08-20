-- AlterTable
ALTER TABLE "CaptchaChallenge" ADD COLUMN "dedupeKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CaptchaChallenge_dedupeKey_key" ON "CaptchaChallenge"("dedupeKey");
