-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "discount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "paymentType" SET DEFAULT 'ONLINE';
