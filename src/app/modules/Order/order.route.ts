import express from "express";
import { OrderControllers } from "./order.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { OrderValidations } from "./order.validation";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.CUSTOMER),
  validateRequest(OrderValidations.create),
  OrderControllers.createOrder
);

export const OrderRoutes = router;
