/*
  Warnings:

  - You are about to drop the column `parent_id` on the `category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_parent_id_fkey";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "parent_id";
