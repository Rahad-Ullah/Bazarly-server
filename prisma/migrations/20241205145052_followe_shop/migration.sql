-- CreateTable
CREATE TABLE "recent_viewed_products" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recent_viewed_products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recent_viewed_products" ADD CONSTRAINT "recent_viewed_products_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recent_viewed_products" ADD CONSTRAINT "recent_viewed_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
