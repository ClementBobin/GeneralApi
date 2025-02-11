/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastFinishedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hashedUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashedUsername` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_finished_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "lastFinishedAt",
DROP COLUMN "updatedAt",
DROP COLUMN "username",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hashedUsername" TEXT NOT NULL,
ADD COLUMN     "last_finished_at" BIGINT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "finishedCount" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "User_hashedUsername_key" ON "User"("hashedUsername");
