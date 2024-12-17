import express from "express";
import { OrderControllers } from "./order.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { OrderValidations } from "./order.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  OrderControllers.getAllOrders
);

router.get(
  "/get-single-order/:id",
  auth(
    UserRole.CUSTOMER,
    UserRole.VENDOR,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN
  ),
  OrderControllers.getSingleOrder
);

// get orders by product id
router.get(
  "/get-product-order/:id",
  auth(
    UserRole.CUSTOMER,
  ),
  OrderControllers.getProductOrder
);

router.get("/my-orders", auth(UserRole.CUSTOMER), OrderControllers.getMyOrders);

router.get(
  "/shop-orders",
  auth(UserRole.VENDOR),
  OrderControllers.getShopOrders
);

router.post(
  "/create",
  auth(UserRole.CUSTOMER),
  validateRequest(OrderValidations.create),
  OrderControllers.createOrder
);

router.patch(
  "/change-status/:id",
  auth(UserRole.VENDOR),
  validateRequest(OrderValidations.changeOrderStatus),
  OrderControllers.changeOrderStatus
);

router.patch(
  "/change-payment-status/:id",
  auth(UserRole.VENDOR),
  validateRequest(OrderValidations.changePaymentStatus),
  OrderControllers.changePaymentStatus
);

export const OrderRoutes = router;
