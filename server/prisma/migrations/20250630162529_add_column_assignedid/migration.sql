/*
  Warnings:

  - Added the required column `assignedId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "assignedId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedId_fkey" FOREIGN KEY ("assignedId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
