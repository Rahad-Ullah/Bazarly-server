import express from "express";
import { OrderItemControllers } from "./orderItem.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { OrderItemValidations } from "./orderItem.validation";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.CUSTOMER),
  validateRequest(OrderItemValidations.create),
  OrderItemControllers.createOrderItem
);

export const OrderItemRoutes = router;
