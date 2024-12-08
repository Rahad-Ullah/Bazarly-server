import { OrderPaymentStatus, OrderStatus, PaymentType } from "@prisma/client";
import { z } from "zod";

const create = z.object({
  body: z.object({
    shopId: z
      .string()
      .min(36, { message: "Shop ID is must be at least 36 characters" }),
    totalAmount: z.number({ required_error: "Total amount is required" }),
    paymentType: z.enum([PaymentType.COD, PaymentType.ONLINE]).optional(),
  }),
});

const changeOrderStatus = z.object({
  body: z.object({
    status: z.enum([
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
    ]),
  }),
});

const changePaymentStatus = z.object({
  body: z.object({
    paymentStatus: z.enum([OrderPaymentStatus.PAID, OrderPaymentStatus.UNPAID]),
  }),
});

export const OrderValidations = {
  create,
  changeOrderStatus,
  changePaymentStatus,
};
