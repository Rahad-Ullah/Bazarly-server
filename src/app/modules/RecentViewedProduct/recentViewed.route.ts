import express from "express";
import { RecentViewedControllers } from "./recentViewed.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.CUSTOMER),
  RecentViewedControllers.createRecentViewedProduct
);

export const RecentViewedRoutes = router;
