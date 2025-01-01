import { z } from "zod";

const create = z.object({
  body: z.object({
    email: z
      .string({ message: "Email is required" })
      .email({ message: "Invalid email address" }),
  }),
});

export const NewsletterValidations = {
  create,
};
