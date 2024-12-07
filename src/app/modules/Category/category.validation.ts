import { z } from "zod";

const create = z.object({
  body: z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    description: z.string().optional(),
    parentId: z.string().optional(),
  }),
});

export const CategoryValidations = {
  create,
};
