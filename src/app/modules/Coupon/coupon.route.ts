import express from "express";
import { CouponControllers } from "./coupon.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CouponValidations } from "./coupon.validation";

const router = express.Router();

router.post(
  "/create",
  validateRequest(CouponValidations.create),
  CouponControllers.createCoupon
);

router.patch(
  "/:id",
  validateRequest(CouponValidations.update),
  CouponControllers.updateCoupon
);

export const CouponRoutes = router;
