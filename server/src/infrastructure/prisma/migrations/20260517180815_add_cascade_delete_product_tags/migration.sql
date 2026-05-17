-- DropForeignKey
ALTER TABLE "product_tag_map" DROP CONSTRAINT "product_tag_map_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_tag_map" DROP CONSTRAINT "product_tag_map_tag_id_fkey";

-- AddForeignKey
ALTER TABLE "product_tag_map" ADD CONSTRAINT "product_tag_map_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tag_map" ADD CONSTRAINT "product_tag_map_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "product_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
