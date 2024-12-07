import express from "express";
import { VendorControllers } from "./vendor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { VendorValidations } from "./vendor.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  VendorControllers.getAllVendors
);

router.get(
  "/:email",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  VendorControllers.getSingleVendor
);

router.patch(
  "/:id",
  validateRequest(VendorValidations.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  VendorControllers.updateVendor
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  VendorControllers.deleteVendor
);

router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  VendorControllers.softDeleteVendor
);

export const VendorRoutes = router;
