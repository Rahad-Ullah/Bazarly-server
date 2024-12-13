import express from "express";
import { RecentViewedControllers } from "./recentViewed.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.CUSTOMER),
  RecentViewedControllers.getRecentViewedProduct
);

router.post(
  "/create",
  auth(UserRole.CUSTOMER),
  RecentViewedControllers.createRecentViewedProduct
);

router.delete(
  "/:id",
  auth(UserRole.CUSTOMER),
  RecentViewedControllers.removeRecentViewedProduct
);

export const RecentViewedRoutes = router;
