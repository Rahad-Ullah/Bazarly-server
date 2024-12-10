import { z } from "zod";
const orderItemSchema = z.object({
  orderId: z
    .string()
    .min(36, { message: "orderId must be at least 36 characters" }),
  productId: z
    .string()
    .min(36, { message: "productId must be at least 36 characters" }),
  quantity: z.number({ required_error: "Quantity is required" }),
  price: z.number({ required_error: "Price is required" }),
  discount: z.number().optional(),
});

const create = z.object({
  body: z.array(orderItemSchema),
});

export const OrderItemValidations = {
  create,
};
