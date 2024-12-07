import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { CustomerControllers } from "./customer.controller";
import { CustomerValidations } from "./customer.validation";

const router = express.Router();

// get all customers
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CustomerControllers.getAllCustomers
);

// get single customer
router.get(
  "/:email",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CustomerControllers.getSingleCustomer
);

// update customer
router.patch(
  "/:id",
  validateRequest(CustomerValidations.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CustomerControllers.updateCustomer
);

// delete customer
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CustomerControllers.deleteCustomer
);

// soft delete customer
router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CustomerControllers.softDeleteCustomer
);

export const CustomerRoutes = router;
