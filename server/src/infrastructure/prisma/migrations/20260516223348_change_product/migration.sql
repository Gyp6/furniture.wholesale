/*
  Warnings:

  - You are about to drop the column `product_variant_id` on the `bundle_item` table. All the data in the column will be lost.
  - You are about to drop the column `product_variant_id` on the `cart_item` table. All the data in the column will be lost.
  - You are about to drop the column `product_variant_id` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `product` table. All the data in the column will be lost.
  - The `images` column on the `product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `name` on the `product_tag` table. All the data in the column will be lost.
  - You are about to drop the `product_variant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceType` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendor` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `product_tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bundle_item" DROP CONSTRAINT "bundle_item_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "product_variant" DROP CONSTRAINT "product_variant_product_id_fkey";

-- AlterTable
ALTER TABLE "bundle_item" DROP COLUMN "product_variant_id";

-- AlterTable
ALTER TABLE "cart_item" DROP COLUMN "product_variant_id";

-- AlterTable
ALTER TABLE "order_item" DROP COLUMN "product_variant_id";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "min_sell_quantity" INTEGER,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "spaceType" "SpaceType" NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vendor" TEXT NOT NULL,
DROP COLUMN "images",
ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "product_tag" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "product_variant";
