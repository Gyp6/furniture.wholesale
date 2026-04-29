/*
  Warnings:

  - You are about to drop the `supplier_profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "supplier_profile" DROP CONSTRAINT "supplier_profile_user_id_fkey";

-- AlterTable
ALTER TABLE "company" ADD COLUMN     "description" TEXT,
ADD COLUMN     "logo_url" TEXT,
ADD COLUMN     "rating_avg" DECIMAL(3,2) NOT NULL DEFAULT 0,
ADD COLUMN     "rating_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "terms" TEXT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;

-- DropTable
DROP TABLE "supplier_profile";

-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company_name" TEXT,
    "specializations" TEXT,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_user_id_key" ON "profile"("user_id");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
