import { z } from "zod";

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    tradeLicenseNumber: z.string().optional(),
    taxId: z.string().optional(),
    businessAddress: z.string().optional(),
  }),
});

export const VendorValidations = {
  update,
};
