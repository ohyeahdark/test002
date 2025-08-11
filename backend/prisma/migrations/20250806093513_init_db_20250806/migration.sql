/*
  Warnings:

  - You are about to drop the column `departmentId` on the `Position` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Position" DROP CONSTRAINT "Position_departmentId_fkey";

-- AlterTable
ALTER TABLE "public"."Position" DROP COLUMN "departmentId";
