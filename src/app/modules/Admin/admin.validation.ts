import { z } from "zod";

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    designation: z.string().optional(),
  }),
});

export const AdminValidations = {
  update,
};
