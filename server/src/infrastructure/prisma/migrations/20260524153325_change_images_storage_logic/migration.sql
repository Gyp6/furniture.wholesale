/*
  Warnings:

  - You are about to drop the column `banner_url` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `logo_url` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "company" DROP COLUMN "banner_url",
DROP COLUMN "logo_url";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "images",
ADD COLUMN     "images_count" INTEGER NOT NULL DEFAULT 0;
