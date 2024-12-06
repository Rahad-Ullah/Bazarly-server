import { z } from "zod";

const login = z.object({
  body: z.object({
    email: z.string().email({ message: "Email must be a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  }),
});

export const AuthValidations = {
  login,
};
