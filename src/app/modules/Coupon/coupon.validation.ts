import { z } from "zod";

const create = z.object({
  body: z.object({
    code: z.string().min(1, { message: "Code is required" }),
    discountAmount: z
      .number()
      .min(1, { message: "Discount Amount is required" }),
    startTime: z.string().min(1, { message: "Start Time is required" }),
    endTime: z.string().min(1, { message: "End Time is required" }),
    usageLimit: z.number().min(1, { message: "Usage Limit is required" }),
  }),
});

const update = z.object({
  body: z.object({
    code: z.string().optional(),
    discountAmount: z.number().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    usageLimit: z.number().optional(),
  }),
});

const applyCoupon = z.object({
  body: z.object({
    code: z.string().min(1, { message: "Coupon is required" }),
  }),
});

export const CouponValidations = {
  create,
  update,
  applyCoupon,
};
