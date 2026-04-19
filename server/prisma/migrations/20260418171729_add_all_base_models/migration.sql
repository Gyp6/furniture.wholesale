/*
  Warnings:

  - You are about to drop the column `address` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `company_name` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `establishment_type` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `portfolio_url` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `tax_id` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified` on the `session` table. All the data in the column will be lost.
  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `account_id` to the `account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SpaceType" AS ENUM ('APARTMENT', 'HOTEL', 'RESTAURANT', 'CAFE', 'COWORKING', 'OFFICE');

-- AlterTable
ALTER TABLE "account" DROP COLUMN "address",
DROP COLUMN "company_name",
DROP COLUMN "email_verified",
DROP COLUMN "establishment_type",
DROP COLUMN "portfolio_url",
DROP COLUMN "specialization",
DROP COLUMN "tax_id",
ADD COLUMN     "account_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "session" DROP COLUMN "email_verified",
ADD COLUMN     "ip_address" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "company_id" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'RETAILER';

-- AlterTable
ALTER TABLE "verification" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- DropEnum
DROP TYPE "EstablishmentType";

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tax_id" TEXT NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_profile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "min_quantity" INTEGER NOT NULL DEFAULT 1,
    "delivery_terms" TEXT,
    "specializations" JSONB,
    "rating_avg" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "rating_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "supplier_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" TEXT,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "images" JSONB,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "material" TEXT,
    "color" TEXT,
    "dimensions" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "min_quantity" INTEGER,

    CONSTRAINT "product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "product_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tag_map" (
    "product_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "product_tag_map_pkey" PRIMARY KEY ("product_id","tag_id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_item" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "product_variant_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "total_amount" DECIMAL(10,2) NOT NULL,
    "platform_fee" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_variant_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_snapshot" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "space_type" "SpaceType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_item" (
    "id" TEXT NOT NULL,
    "bundle_id" TEXT NOT NULL,
    "product_variant_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_snapshot" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "bundle_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space_template" (
    "id" TEXT NOT NULL,
    "space_type" "SpaceType" NOT NULL,
    "category_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "space_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "order_id" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_tax_id_key" ON "company"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_profile_user_id_key" ON "supplier_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_sku_key" ON "product_variant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_tag_slug_key" ON "product_tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cart_user_id_key" ON "cart"("user_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_profile" ADD CONSTRAINT "supplier_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tag_map" ADD CONSTRAINT "product_tag_map_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tag_map" ADD CONSTRAINT "product_tag_map_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "product_tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle" ADD CONSTRAINT "bundle_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_item" ADD CONSTRAINT "bundle_item_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_item" ADD CONSTRAINT "bundle_item_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_template" ADD CONSTRAINT "space_template_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
