import express from "express";
import { AdminControllers } from "./admin.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", AdminControllers.getAllAdmins);

router.get(
  "/:email",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminControllers.getSingleAdmin
);

export const AdminRoutes = router;
