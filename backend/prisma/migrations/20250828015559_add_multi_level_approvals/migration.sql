/*
  Warnings:

  - You are about to drop the column `approverEmployeeId` on the `LeaveRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `LeaveRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('LEAVE_REQUEST', 'LEAVE_STATUS');

-- DropForeignKey
ALTER TABLE "public"."LeaveRequest" DROP CONSTRAINT "LeaveRequest_approverEmployeeId_fkey";

-- AlterTable
ALTER TABLE "public"."LeaveRequest" DROP COLUMN "approverEmployeeId",
ADD COLUMN     "currentApprovalOrder" INTEGER;

-- CreateTable
CREATE TABLE "public"."LeaveApproval" (
    "id" TEXT NOT NULL,
    "leaveRequestId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "approverEmployeeId" TEXT NOT NULL,
    "status" "public"."ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "recipientEmployeeId" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL DEFAULT 'LEAVE_REQUEST',
    "title" TEXT NOT NULL,
    "body" TEXT,
    "link" TEXT,
    "data" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeaveApproval_approverEmployeeId_status_idx" ON "public"."LeaveApproval"("approverEmployeeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveApproval_leaveRequestId_order_key" ON "public"."LeaveApproval"("leaveRequestId", "order");

-- CreateIndex
CREATE INDEX "Notification_recipientEmployeeId_readAt_idx" ON "public"."Notification"("recipientEmployeeId", "readAt");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveRequest_id_key" ON "public"."LeaveRequest"("id");

-- AddForeignKey
ALTER TABLE "public"."LeaveApproval" ADD CONSTRAINT "LeaveApproval_leaveRequestId_fkey" FOREIGN KEY ("leaveRequestId") REFERENCES "public"."LeaveRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaveApproval" ADD CONSTRAINT "LeaveApproval_approverEmployeeId_fkey" FOREIGN KEY ("approverEmployeeId") REFERENCES "public"."Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_recipientEmployeeId_fkey" FOREIGN KEY ("recipientEmployeeId") REFERENCES "public"."Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
