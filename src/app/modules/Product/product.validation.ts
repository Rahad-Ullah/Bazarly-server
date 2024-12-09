import { z } from "zod";

const create = z.object({
  body: z.object({
    shopId: z
      .string()
      .min(36, { message: "Shop ID must be at least 36 characters" }),
    categoryId: z
      .string()
      .min(36, { message: "Category ID must be at least 36 characters" }),
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters" }),
    price: z.number({ required_error: "Price is required" }),
    stock: z.number({ required_error: "Stock is required" }),
    discount: z.number({ required_error: "Discount is required" }),
    images: z.array(z.string()).optional(),
  }),
});

export const ProductValidations = {
  create,
};
