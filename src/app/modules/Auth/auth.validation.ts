import { z } from "zod";

const login = z.object({
  body: z.object({
    email: z.string().email({ message: "Email must be a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  }),
});

const changePassword = z.object({
  body: z.object({
    oldPassword: z
      .string()
      .min(6, { message: "Old password must be at least 6 characters" }),
    newPassword: z
      .string()
      .min(6, { message: "New password must be at least 6 characters" }),
  }),
});

const forgotPassword = z.object({
  body: z.object({
    email: z.string().email({ message: "Email must be a valid email address" }),
  }),
});

const resetPassword = z.object({
  body: z.object({
    id: z.string().min(36, { message: "ID must be at least 36 characters" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  }),
});

export const AuthValidations = {
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};
