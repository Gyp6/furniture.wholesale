/*
  Warnings:

  - You are about to drop the column `company_name` on the `profile` table. All the data in the column will be lost.
  - The `specializations` column on the `profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `company_id` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_company_id_fkey";

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "company_name",
ADD COLUMN     "company_id" TEXT,
DROP COLUMN "specializations",
ADD COLUMN     "specializations" TEXT[];

-- AlterTable
ALTER TABLE "user" DROP COLUMN "company_id";

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
