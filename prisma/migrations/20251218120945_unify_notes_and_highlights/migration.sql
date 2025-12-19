/*
  Warnings:

  - You are about to drop the `highlights` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "highlights" DROP CONSTRAINT "highlights_anchor_id_fkey";

-- DropForeignKey
ALTER TABLE "highlights" DROP CONSTRAINT "highlights_user_id_fkey";

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "end_offset" INTEGER,
ADD COLUMN     "start_offset" INTEGER;

-- DropTable
DROP TABLE "highlights";
