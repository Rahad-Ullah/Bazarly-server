-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'DRAFT', 'PAUSED', 'ARCHIVED', 'DELETED');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT';
