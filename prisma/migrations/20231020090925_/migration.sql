/*
  Warnings:

  - You are about to drop the column `banner` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "banner",
ADD COLUMN     "image" TEXT;
