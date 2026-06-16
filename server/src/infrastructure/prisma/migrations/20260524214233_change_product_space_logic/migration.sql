/*
  Warnings:

  - You are about to drop the column `space_type_id` on the `product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_space_type_id_fkey";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "space_type_id";

-- CreateTable
CREATE TABLE "product_space_map" (
    "product_id" TEXT NOT NULL,
    "space_type_id" TEXT NOT NULL,

    CONSTRAINT "product_space_map_pkey" PRIMARY KEY ("product_id","space_type_id")
);

-- AddForeignKey
ALTER TABLE "product_space_map" ADD CONSTRAINT "product_space_map_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_space_map" ADD CONSTRAINT "product_space_map_space_type_id_fkey" FOREIGN KEY ("space_type_id") REFERENCES "space_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
