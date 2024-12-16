import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../utils/fileUploader";

const router = express.Router();

router.get(
  "/get-profile",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER
  ),
  UserControllers.getMyProfile
);

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidations.createAdmin),
  UserControllers.createAdmin
);

router.post(
  "/create-vendor",
  validateRequest(UserValidations.createVendor),
  UserControllers.createVendor
);

router.post(
  "/create-customer",
  validateRequest(UserValidations.createCustomer),
  UserControllers.createCustomer
);

router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidations.changeUserStatus),
  UserControllers.changeUserStatus
);

router.patch(
  "/update-profile",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER
  ),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserControllers.updateMyProfile(req, res, next);
  }
);

export const UserRoutes = router;
