import express from "express";
import { AuthControllers } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidations.login),
  AuthControllers.login
);

router.post("/refresh-token", AuthControllers.refreshToken);

router.post(
  "/change-password",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER
  ),
  validateRequest(AuthValidations.changePassword),
  AuthControllers.changePassword
);

router.post(
  "/forgot-password",
  validateRequest(AuthValidations.forgotPassword),
  AuthControllers.forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidations.resetPassword),
  AuthControllers.resetPassword
);

export const AuthRoutes = router;
