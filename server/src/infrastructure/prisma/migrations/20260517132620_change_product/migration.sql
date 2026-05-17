/*
  Warnings:

  - You are about to drop the column `spaceType` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `vendor` on the `product` table. All the data in the column will be lost.
  - Added the required column `space_type` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendor_id` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "spaceType",
DROP COLUMN "vendor",
ADD COLUMN     "space_type" "SpaceType" NOT NULL,
ADD COLUMN     "vendor_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
