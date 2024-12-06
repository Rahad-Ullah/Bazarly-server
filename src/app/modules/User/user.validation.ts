import { z } from "zod";

const createAdmin = z.object({
  body: z.object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    data: z.object({
      name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters" }),
      email: z
        .string()
        .email({ message: "Email must be a valid email address" }),
      phoneNumber: z
        .string()
        .min(11, { message: "Name must be at least 11 digit" }),
      profilePhoto: z
        .string()
        .optional()
        .default("https://cdn-icons-png.flaticon.com/512/6596/6596121.png"),
      designation: z.string().optional(),
    }),
  }),
});

const createVendor = z.object({
  body: z.object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    data: z.object({
      name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters" }),
      email: z
        .string()
        .email({ message: "Email must be a valid email address" }),
      phoneNumber: z
        .string()
        .min(11, { message: "Name must be at least 11 digit" }),
      profilePhoto: z
        .string()
        .optional()
        .default("https://cdn-icons-png.flaticon.com/512/6596/6596121.png"),
      tradeLicenseNumber: z.string().optional(),
      taxId: z.string().optional(),
      businessAddress: z.string().optional(),
    }),
  }),
});

export const UserValidations = {
  createAdmin,
  createVendor,
};
