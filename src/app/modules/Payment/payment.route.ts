import express from "express";
import { PaymentControllers } from "./payment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/:id",
  auth(UserRole.CUSTOMER),
  PaymentControllers.getSinglePayment
);

router.post(
  "/create",
  auth(UserRole.CUSTOMER),
  PaymentControllers.createPayment
);

router.post("/success", PaymentControllers.successPayment);
router.post("/fail", PaymentControllers.failPayment);
router.post("/cancel", PaymentControllers.cancelPayment);

export const PaymentRoutes = router;
