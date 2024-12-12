import express from "express";
import { CouponControllers } from "./coupon.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CouponValidations } from "./coupon.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CouponControllers.getAllCoupons
);

router.post(
  "/create",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(CouponValidations.create),
  CouponControllers.createCoupon
);

router.post(
  "/apply-coupon",
  auth(UserRole.CUSTOMER),
  validateRequest(CouponValidations.applyCoupon),
  CouponControllers.applyCoupon
);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(CouponValidations.update),
  CouponControllers.updateCoupon
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CouponControllers.deleteCoupon
);

export const CouponRoutes = router;
