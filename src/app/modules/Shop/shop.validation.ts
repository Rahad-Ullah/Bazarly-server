import { ShopStatus } from "@prisma/client";
import { z } from "zod";

const changeShopStatus = z.object({
  body: z.object({
    status: z.enum([
      ShopStatus.ACTIVE,
      ShopStatus.BLOCKED,
      ShopStatus.DELETED,
      ShopStatus.PENDING,
      ShopStatus.SUSPENDED,
    ]),
  }),
});

export const ShopValidations = {
  changeShopStatus,
};
