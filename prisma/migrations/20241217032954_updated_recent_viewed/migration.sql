/*
  Warnings:

  - You are about to drop the column `customerId` on the `recent_viewed_products` table. All the data in the column will be lost.
  - Added the required column `userId` to the `recent_viewed_products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "recent_viewed_products" DROP CONSTRAINT "recent_viewed_products_customerId_fkey";

-- AlterTable
ALTER TABLE "recent_viewed_products" DROP COLUMN "customerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "recent_viewed_products" ADD CONSTRAINT "recent_viewed_products_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
