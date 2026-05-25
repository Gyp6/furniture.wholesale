/*
  Warnings:

  - You are about to drop the column `space_type` on the `bundle` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_id` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `space_type` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `space_type` on the `space_template` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[share_token]` on the table `bundle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bundle_type` to the `bundle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `space_type_id` to the `bundle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `bundle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku_snapshot` to the `order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_order_id` to the `order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_snapshot` to the `order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `space_type_id` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `space_type_id` to the `space_template` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BundleType" AS ENUM ('SUPPLIER', 'USER');

-- DropForeignKey
ALTER TABLE "bundle_item" DROP CONSTRAINT "bundle_item_bundle_id_fkey";

-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_user_id_fkey";

-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_user_id_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_order_id_fkey";

-- AlterTable
ALTER TABLE "bundle" DROP COLUMN "space_type",
ADD COLUMN     "bundle_type" "BundleType" NOT NULL,
ADD COLUMN     "depth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "is_shared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parent_bundle_id" TEXT,
ADD COLUMN     "share_token" TEXT,
ADD COLUMN     "space_type_id" TEXT NOT NULL,
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "bundle_item" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nested_bundle_id" TEXT,
ADD COLUMN     "product_id" TEXT,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "cart_item" ADD COLUMN     "bundle_id" TEXT,
ADD COLUMN     "product_id" TEXT,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "order_item" DROP COLUMN "order_id",
DROP COLUMN "supplier_id",
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "sku_snapshot" TEXT NOT NULL,
ADD COLUMN     "sub_order_id" TEXT NOT NULL,
ADD COLUMN     "title_snapshot" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "space_type",
ADD COLUMN     "space_type_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "space_template" DROP COLUMN "space_type",
ADD COLUMN     "space_type_id" TEXT NOT NULL;

-- DropEnum
DROP TYPE "SpaceType";

-- CreateTable
CREATE TABLE "space_type" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "space_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_order" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "supplier_id" TEXT NOT NULL,
    "source_bundle_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "space_type_slug_key" ON "space_type"("slug");

-- CreateIndex
CREATE INDEX "space_type_slug_idx" ON "space_type"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "bundle_share_token_key" ON "bundle"("share_token");

-- CreateIndex
CREATE INDEX "bundle_share_token_idx" ON "bundle"("share_token");

-- CreateIndex
CREATE INDEX "bundle_bundle_type_depth_idx" ON "bundle"("bundle_type", "depth");

-- CreateIndex
CREATE INDEX "bundle_item_bundle_id_idx" ON "bundle_item"("bundle_id");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_space_type_id_fkey" FOREIGN KEY ("space_type_id") REFERENCES "space_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_template" ADD CONSTRAINT "space_template_space_type_id_fkey" FOREIGN KEY ("space_type_id") REFERENCES "space_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle" ADD CONSTRAINT "bundle_space_type_id_fkey" FOREIGN KEY ("space_type_id") REFERENCES "space_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle" ADD CONSTRAINT "bundle_parent_bundle_id_fkey" FOREIGN KEY ("parent_bundle_id") REFERENCES "bundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_item" ADD CONSTRAINT "bundle_item_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_item" ADD CONSTRAINT "bundle_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_item" ADD CONSTRAINT "bundle_item_nested_bundle_id_fkey" FOREIGN KEY ("nested_bundle_id") REFERENCES "bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_order" ADD CONSTRAINT "sub_order_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_order" ADD CONSTRAINT "sub_order_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_order" ADD CONSTRAINT "sub_order_source_bundle_id_fkey" FOREIGN KEY ("source_bundle_id") REFERENCES "bundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_sub_order_id_fkey" FOREIGN KEY ("sub_order_id") REFERENCES "sub_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE "bundle_item"
ADD CONSTRAINT "chk_bundle_item_one_target"
CHECK (
  ("product_id" IS NOT NULL AND "nested_bundle_id" IS NULL)
  OR
  ("product_id" IS NULL AND "nested_bundle_id" IS NOT NULL)
);


ALTER TABLE "cart_item"
ADD CONSTRAINT "chk_cart_item_one_target"
CHECK (
  ("product_id" IS NOT NULL AND "bundle_id" IS NULL)
  OR
  ("product_id" IS NULL AND "bundle_id" IS NOT NULL)
);
