import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-admin",
  auth(UserRole.ADMIN),
  validateRequest(UserValidations.createAdmin),
  UserControllers.createAdmin
);

export const UserRoutes = router