import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { CustomerControllers } from "./customer.controller";
import { CustomerValidations } from "./customer.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CustomerControllers.getAllCustomers
);

router.get(
  "/:email",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CustomerControllers.getSingleCustomer
);

router.patch(
  "/:id",
  validateRequest(CustomerValidations.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CustomerControllers.updateCustomer
);

// router.delete(
//   "/:id",
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//   VendorControllers.deleteVendor
// );

// router.delete(
//   "/soft/:id",
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//   VendorControllers.softDeleteVendor
// );

export const CustomerRoutes = router;
