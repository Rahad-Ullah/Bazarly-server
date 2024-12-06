import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidations.createAdmin),
  UserControllers.createAdmin
);

router.post(
  "/create-vendor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidations.createVendor),
  UserControllers.createVendor
);

router.post(
  "/create-customer",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidations.createCustomer),
  UserControllers.createCustomer
);

router.patch(
  "/:id/status",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidations.changeUserStatus),
  UserControllers.changeUserStatus
);

export const UserRoutes = router