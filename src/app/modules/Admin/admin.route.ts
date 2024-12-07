import express from "express";
import { AdminControllers } from "./admin.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidations } from "./admin.validation";

const router = express.Router();

router.get("/", AdminControllers.getAllAdmins);

router.get(
  "/:email",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminControllers.getSingleAdmin
);

router.patch(
  "/:id",
  validateRequest(AdminValidations.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminControllers.updateAdmin
);

export const AdminRoutes = router;