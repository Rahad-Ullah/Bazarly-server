import express from "express";
import { FollowedShopControllers } from "./followedShop.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// router.get('/', )

router.post(
  "/follow",
  auth(UserRole.CUSTOMER),
  FollowedShopControllers.followShop
);

router.delete(
  "/unfollow",
  auth(UserRole.CUSTOMER),
  FollowedShopControllers.unFollowShop
);

export const FollowedShopRoutes = router;
