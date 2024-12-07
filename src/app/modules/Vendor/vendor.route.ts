import express from "express";
import { VendorControllers } from "./vendor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

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

// router.patch(
//   "/:id",
//   validateRequest(AdminValidations.update),
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//   AdminControllers.updateAdmin
// );

// router.delete(
//   "/:id",
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//   AdminControllers.deleteAdmin
// );

// router.delete(
//   "/soft/:id",
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//   AdminControllers.softDeleteAdmin
// );

export const VendorRoutes = router;
