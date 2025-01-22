/*
  Warnings:

  - You are about to drop the `Promotion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PromotionSlab` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PromotionSlab" DROP CONSTRAINT "PromotionSlab_promotionId_fkey";

-- DropTable
DROP TABLE "Promotion";

-- DropTable
DROP TABLE "PromotionSlab";

-- CreateTable
CREATE TABLE "promotions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "discountValue" DOUBLE PRECISION,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_slabs" (
    "id" SERIAL NOT NULL,
    "promotionId" INTEGER NOT NULL,
    "minWeight" DOUBLE PRECISION NOT NULL,
    "maxWeight" DOUBLE PRECISION NOT NULL,
    "discountPerUnit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "promotion_slabs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "promotion_slabs" ADD CONSTRAINT "promotion_slabs_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
