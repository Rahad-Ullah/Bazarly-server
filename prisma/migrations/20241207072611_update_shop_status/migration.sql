-- CreateEnum
CREATE TYPE "ShopStatus" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'BLOCKED', 'DELETED');

-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "status" "ShopStatus" NOT NULL DEFAULT 'ACTIVE';
