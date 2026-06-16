/*
  Warnings:

  - A unique constraint covering the columns `[business_email]` on the table `company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[showroom_address]` on the table `company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "company" ADD COLUMN     "banner_url" TEXT,
ADD COLUMN     "business_email" TEXT,
ADD COLUMN     "lead_time" TEXT,
ADD COLUMN     "showroom_address" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "company_business_email_key" ON "company"("business_email");

-- CreateIndex
CREATE UNIQUE INDEX "company_showroom_address_key" ON "company"("showroom_address");
