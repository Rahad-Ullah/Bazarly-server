import { z } from "zod";

const create = z.object({
  body: z.object({
    rating: z.number().min(1, { message: "Rating is required" }),
    comment: z.string().optional(),
    productId: z
      .string()
      .min(36, { message: "Product ID must be at least 36 characters" }),
  }),
});

export const ReviewValidations = {
  create,
};
